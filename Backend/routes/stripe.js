import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

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
          cart.products.map((p) => ({
            _id: p._id,
            title: p.title,
            img: p.img,
            quantity: p.quantity,
            price: p.price,
          }))
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
  console.log("Webhook received, sig:", sig, "body length:", req.body.length);

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

    console.log("Session metadata:", session.metadata);

    const shipping = session.shipping_details;
    const phone = session.customer_details.phone;
    const fullAddress = shipping
      ? `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.state}, ${shipping.address.country}`
      : "";

    try {
      const newOrder = new Order({
        name: session.metadata.name,
        userId: session.metadata.userId,
        email: session.customer_details.email,
        phone,
        address: fullAddress,
        products: JSON.parse(session.metadata.products),
        total: parseFloat(session.metadata.total),
        status: 1,
        stripeSessionId: session.id,
      });

      const savedOrder = await newOrder.save();
      console.log(
        "Order saved successfully:",
        savedOrder._id,
        "for user:",
        savedOrder.userId
      );
    } catch (dbErr) {
      console.error("Order save failed:", dbErr);
    }
  }

  res.status(200).send("OK");
});

export default router;
