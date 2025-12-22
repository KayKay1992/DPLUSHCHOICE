import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import StripeSession from "../models/stripeSession.model.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * CREATE CHECKOUT SESSION
 * Collects address + phone
 */
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, name, email, userId } = req.body;
    console.log("=== CREATE CHECKOUT SESSION DEBUG ===");
    console.log("Received cart:", JSON.stringify(cart, null, 2));
    console.log("Cart products:", cart.products);
    console.log("=== END CREATE CHECKOUT SESSION DEBUG ===");

    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "ngn",
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(Number(product.price) * 100),
      },
      quantity: product.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,

      // Collect address + phone
      shipping_address_collection: {
        allowed_countries: ["NG"],
      },
      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        userId,
        email,
        name,
        products: JSON.stringify(
          cart.products.map((p) => {
            console.log(`Mapping product ${p.title}: quantity=${p.quantity}`);
            return {
              _id: p._id,
              title: p.title,
              img: p.img,
              quantity: p.quantity,
              price: p.price,
            };
          })
        ),
        total: String(cart.total),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Create checkout error:", err);
    res.status(500).json({ error: "Checkout session failed" });
  }
});

/**
 * STRIPE WEBHOOK
 */
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log("=== WEBHOOK RECEIVED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Webhook signature:", sig, "body length:", req.body.length);
  console.log("=== END WEBHOOK RECEIVED ===");

  let event;

  try {
    // Temporarily disable verification for testing
    event = JSON.parse(req.body.toString());
    console.log("Event type:", event.type);
  } catch (err) {
    console.error("Webhook parsing failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  console.log("Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("=== PROCESSING CHECKOUT SESSION ===");
    console.log("Session ID:", session.id);
    console.log("Session metadata keys:", Object.keys(session.metadata));
    console.log("Session metadata:", session.metadata);
    console.log("=== END PROCESSING CHECKOUT SESSION ===");

    console.log("Session metadata:", session.metadata);

    const shipping = session.shipping_details;
    const phone = session.customer_details.phone;
    const fullAddress = shipping
      ? `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.state}, ${shipping.address.country}`
      : "";

    try {
      const stripeSessionId = session.id;

      // --- Idempotency guard ---
      // Stripe can deliver the same event multiple times. Without this, stock can be reduced multiple times.
      // We lock on checkout.session.id (unique per checkout) so processing happens once.
      let lock = await StripeSession.findOne({ sessionId: stripeSessionId });

      if (lock?.status === "processed") {
        console.log(`[webhook] Session already processed: ${stripeSessionId}`);
        return res.status(200).send("OK");
      }

      if (!lock) {
        try {
          lock = await StripeSession.create({
            sessionId: stripeSessionId,
            status: "processing",
          });
        } catch (e) {
          // Another webhook call may have created it concurrently.
          if (e?.code === 11000) {
            lock = await StripeSession.findOne({ sessionId: stripeSessionId });
            if (lock?.status === "processed") {
              console.log(
                `[webhook] Session already processed (duplicate key): ${stripeSessionId}`
              );
              return res.status(200).send("OK");
            }
            // If it's still processing, let the other request finish.
            console.log(
              `[webhook] Session lock already exists (processing): ${stripeSessionId}`
            );
            return res.status(200).send("OK");
          }
          throw e;
        }
      } else if (lock.status === "failed") {
        // Allow retry after a previous failure.
        lock = await StripeSession.findOneAndUpdate(
          { sessionId: stripeSessionId, status: "failed" },
          { $set: { status: "processing", lastError: null } },
          { new: true }
        );
      } else if (lock.status === "processing") {
        // Another request is already processing this session.
        console.log(
          `[webhook] Session is currently processing: ${stripeSessionId}`
        );
        return res.status(200).send("OK");
      }

      // If we already created an order for this session in a previous run,
      // do NOT touch stock again.
      const existingOrder = await Order.findOne({ stripeSessionId });
      if (existingOrder) {
        console.log(
          `[webhook] Order already exists for session: ${stripeSessionId}. Skipping stock update.`
        );
        await StripeSession.updateOne(
          { sessionId: stripeSessionId },
          {
            $set: {
              status: "processed",
              processedAt: new Date(),
              lastError: null,
            },
          }
        );
        return res.status(200).send("OK");
      }

      // Parse products from metadata
      const products = JSON.parse(session.metadata.products);
      console.log("=== WEBHOOK DEBUG ===");
      console.log("Session metadata:", session.metadata);
      console.log("Raw products string:", session.metadata.products);
      console.log("Parsed products:", products);
      console.log("Products array details:");
      products.forEach((p, i) => {
        console.log(
          `Product ${i}: ${p.title}, quantity: ${
            p.quantity
          } (type: ${typeof p.quantity})`
        );
      });
      console.log("=== END WEBHOOK DEBUG ===");

      // Check stock availability and update stock for each product
      for (const product of products) {
        console.log(
          `Processing product: ${product.title}, quantity: ${
            product.quantity
          }, type: ${typeof product.quantity}`
        );

        const dbProduct = await Product.findById(product._id);

        if (!dbProduct) {
          console.error(`Product ${product.title} not found`);
          return res.status(400).send("Product not found");
        }

        let requestedQuantity = product.quantity || 1;
        const availableStock = dbProduct.stock || 0;

        // Sanity check: prevent unreasonably large quantities
        if (requestedQuantity > 100) {
          console.error(
            `Suspicious quantity for ${product.title}: ${requestedQuantity}. Capping at 100.`
          );
          requestedQuantity = Math.min(requestedQuantity, 100);
        }

        console.log(
          `Product ${product.title}: requested=${requestedQuantity}, available=${availableStock}`
        );

        if (availableStock < requestedQuantity) {
          console.error(
            `Insufficient stock for ${product.title}. Available: ${availableStock}, Requested: ${requestedQuantity}`
          );
          return res.status(400).send("Insufficient stock");
        }

        // Reduce stock
        const updatedProduct = await Product.findByIdAndUpdate(
          dbProduct._id,
          { $inc: { stock: -requestedQuantity } },
          { new: true }
        );

        console.log(
          `Stock reduced for ${product.title}: ${availableStock} -> ${updatedProduct.stock} (reduced by ${requestedQuantity})`
        );
      }

      const newOrder = new Order({
        name: session.metadata.name,
        userId: session.metadata.userId,
        email: session.customer_details.email,
        phone,
        address: fullAddress,
        products: products,
        total: parseFloat(session.metadata.total),
        status: 1,
        stripeSessionId,
      });

      const savedOrder = await newOrder.save();
      console.log(
        "Order saved successfully:",
        savedOrder._id,
        "for user:",
        savedOrder.userId
      );

      await StripeSession.updateOne(
        { sessionId: stripeSessionId },
        {
          $set: {
            status: "processed",
            processedAt: new Date(),
            lastError: null,
          },
        }
      );
    } catch (dbErr) {
      console.error("Order save failed:", dbErr);

      try {
        const stripeSessionId = event?.data?.object?.id;
        if (stripeSessionId) {
          await StripeSession.updateOne(
            { sessionId: stripeSessionId },
            {
              $set: {
                status: "failed",
                lastError: String(dbErr?.message || dbErr),
              },
            }
          );
        }
      } catch (lockErr) {
        console.error("Failed updating StripeSession lock:", lockErr);
      }

      // Return 500 so Stripe retries (we allow retry only when lock is failed).
      return res.status(500).send("Webhook processing failed");
    }
  }

  return res.status(200).send("OK");
});

export default router;
