import axios from "axios";
import crypto from "crypto";
import asyncHandler from "express-async-handler";

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import PaystackTransaction from "../models/paystackTransaction.model.js";

const PAYSTACK_API_BASE = "https://api.paystack.co";

const getPaystackSecret = () =>
  String(
    process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET || ""
  ).trim();

const assertPaystackConfigured = () => {
  const sk = getPaystackSecret();
  if (!sk) {
    const err = new Error(
      "Paystack is not configured (missing PAYSTACK_SECRET_KEY). Set PAYSTACK_SECRET_KEY (or PAYSTACK_SECRET) in Backend/.env and restart the backend."
    );
    err.statusCode = 500;
    throw err;
  }
  return sk;
};

const toKobo = (ngn) => {
  const n = Number(ngn);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
};

const buildReference = () => {
  const suffix = crypto.randomBytes(8).toString("hex");
  return `DPLUSH_${Date.now()}_${suffix}`;
};

const computeCartFromDb = async (cart) => {
  const items = Array.isArray(cart?.products) ? cart.products : [];
  if (items.length === 0) {
    const err = new Error("Cart is empty or invalid");
    err.statusCode = 400;
    throw err;
  }

  const normalized = [];
  let total = 0;

  for (const item of items) {
    const id = item?._id || item?.id;
    const qty = Number(item?.quantity || 1);
    if (!id) {
      const err = new Error("Cart item is missing product id");
      err.statusCode = 400;
      throw err;
    }
    if (!Number.isFinite(qty) || qty < 1) {
      const err = new Error("Invalid quantity in cart");
      err.statusCode = 400;
      throw err;
    }

    const dbProduct = await Product.findById(id);
    if (!dbProduct) {
      const err = new Error("One or more products no longer exist");
      err.statusCode = 404;
      throw err;
    }

    const hasWholesale =
      typeof dbProduct.wholesalePrice === "number" &&
      typeof dbProduct.wholesaleMinimumQuantity === "number";
    const wholesaleActive =
      hasWholesale && qty >= dbProduct.wholesaleMinimumQuantity;

    const unitPrice = wholesaleActive
      ? dbProduct.wholesalePrice
      : typeof dbProduct.discountPrice === "number"
      ? dbProduct.discountPrice
      : dbProduct.originalPrice;

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      const err = new Error(`Invalid price for product: ${dbProduct.title}`);
      err.statusCode = 400;
      throw err;
    }

    const lineTotal = unitPrice * qty;
    total += lineTotal;

    normalized.push({
      _id: String(dbProduct._id),
      title: dbProduct.title,
      img: dbProduct.img,
      quantity: qty,
      price: unitPrice,
      isWholesale: Boolean(wholesaleActive),
    });
  }

  return {
    products: normalized,
    total: Math.round(total * 100) / 100,
  };
};

const acquireTransactionLock = async (reference) => {
  let lock = await PaystackTransaction.findOne({ reference });

  if (lock?.status === "processed") return lock;
  if (!lock) {
    try {
      lock = await PaystackTransaction.create({
        reference,
        status: "processing",
      });
      return lock;
    } catch (e) {
      if (e?.code === 11000) {
        lock = await PaystackTransaction.findOne({ reference });
        return lock;
      }
      throw e;
    }
  }

  if (lock.status === "failed") {
    lock = await PaystackTransaction.findOneAndUpdate(
      { reference, status: "failed" },
      { $set: { status: "processing", lastError: null } },
      { new: true }
    );
  }

  return lock;
};

const markLockProcessed = async (reference) => {
  await PaystackTransaction.updateOne(
    { reference },
    { $set: { status: "processed", processedAt: new Date(), lastError: null } }
  );
};

const markLockFailed = async (reference, err) => {
  await PaystackTransaction.updateOne(
    { reference },
    {
      $set: {
        status: "failed",
        lastError: String(err?.message || err),
      },
    }
  );
};

const reduceStockAtomically = async (products) => {
  for (const p of products) {
    const qty = Number(p.quantity || 1);
    const updated = await Product.findOneAndUpdate(
      { _id: p._id, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );

    if (!updated) {
      const err = new Error(
        `Insufficient stock for ${
          p.title || "a product"
        }. Please refresh and try again.`
      );
      err.statusCode = 400;
      throw err;
    }
  }
};

const createOrderIfNeeded = async ({ reference, metadata, paidAt }) => {
  const existing = await Order.findOne({ paymentReference: reference });
  if (existing) return existing;

  const products = Array.isArray(metadata?.cart?.products)
    ? metadata.cart.products
    : [];
  const total = Number(metadata?.cart?.total);
  const userId = String(metadata?.userId || "");

  if (!userId || products.length === 0 || !Number.isFinite(total)) {
    const err = new Error("Missing order metadata (userId/products/total)");
    err.statusCode = 400;
    throw err;
  }

  await reduceStockAtomically(products);

  const order = new Order({
    name: metadata?.name || "",
    userId,
    email: metadata?.email || "",
    phone: metadata?.phone || "",
    address: metadata?.address || "",
    products,
    total,

    // existing order pipeline expects status 0 for pending
    status: 0,

    // payment fields
    paymentProvider: "paystack",
    paymentReference: reference,
    paymentStatus: "paid",
    paidAt: paidAt || new Date(),
  });

  return await order.save();
};

export const initializePaystack = asyncHandler(async (req, res) => {
  const secret = assertPaystackConfigured();

  const { cart } = req.body || {};

  const computed = await computeCartFromDb(cart);
  const amountKobo = toKobo(computed.total);
  if (!amountKobo) {
    res.status(400);
    throw new Error("Invalid cart total");
  }

  const reference = buildReference();
  const clientUrl = String(
    process.env.CLIENT_URL || "http://localhost:5173"
  ).trim();
  const callbackUrl = `${clientUrl.replace(/\/$/, "")}/paystack/callback`;

  const user = req.user;
  const email = String(user?.email || req.body?.email || "").trim();
  const name = String(user?.name || req.body?.name || "").trim();
  const address = String(user?.address || "").trim();
  const phone = String(user?.phone || "").trim();

  if (!email) {
    res.status(400);
    throw new Error("User email is required for Paystack");
  }

  const metadata = {
    userId: String(user?._id || user?.id || "").trim(),
    email,
    name,
    address,
    phone,
    cart: {
      products: computed.products,
      total: computed.total,
      currency: "NGN",
    },
  };

  const response = await axios.post(
    `${PAYSTACK_API_BASE}/transaction/initialize`,
    {
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      currency: "NGN",
      metadata,
    },
    {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      validateStatus: (s) => s >= 200 && s < 300,
    }
  );

  const data = response?.data;
  const authUrl = data?.data?.authorization_url;

  if (!authUrl) {
    res.status(502);
    throw new Error("Paystack did not return an authorization URL");
  }

  return res.status(200).json({
    reference,
    authorization_url: authUrl,
  });
});

export const verifyPaystack = asyncHandler(async (req, res) => {
  const secret = assertPaystackConfigured();

  const reference = String(
    req.params.reference || req.query.reference || ""
  ).trim();
  if (!reference) {
    res.status(400);
    throw new Error("reference is required");
  }

  // If order already exists, return it.
  const existing = await Order.findOne({ paymentReference: reference });
  if (existing) {
    return res.status(200).json({
      status: "already_processed",
      order: existing,
    });
  }

  const verifyRes = await axios.get(
    `${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      validateStatus: (s) => s >= 200 && s < 300,
    }
  );

  const paystackData = verifyRes?.data?.data;
  const paymentStatus = String(paystackData?.status || "");

  if (paymentStatus !== "success") {
    return res.status(200).json({
      status: "not_success",
      paystackStatus: paymentStatus,
      message: "Payment is not successful yet.",
    });
  }

  const metadata = paystackData?.metadata;

  // Acquire idempotency lock to avoid double stock reduction.
  const lock = await acquireTransactionLock(reference);
  if (lock?.status === "processed") {
    const order = await Order.findOne({ paymentReference: reference });
    return res.status(200).json({ status: "processed", order });
  }
  if (lock?.status === "processing") {
    try {
      const order = await createOrderIfNeeded({
        reference,
        metadata,
        paidAt: paystackData?.paid_at
          ? new Date(paystackData.paid_at)
          : new Date(),
      });
      await markLockProcessed(reference);
      return res.status(200).json({ status: "processed", order });
    } catch (e) {
      await markLockFailed(reference, e);
      throw e;
    }
  }

  return res.status(200).json({ status: "unknown" });
});

export const paystackWebhook = asyncHandler(async (req, res) => {
  const secret = assertPaystackConfigured();

  const signature = String(req.headers["x-paystack-signature"] || "").trim();
  const raw = req.body; // Buffer (because we mount express.raw on this route)

  if (!Buffer.isBuffer(raw)) {
    return res.status(400).send("Invalid webhook body");
  }

  const computed = crypto
    .createHmac("sha512", secret)
    .update(raw)
    .digest("hex");

  if (!signature || computed !== signature) {
    return res.status(401).send("Invalid signature");
  }

  let event;
  try {
    event = JSON.parse(raw.toString("utf8"));
  } catch {
    return res.status(400).send("Invalid JSON");
  }

  const eventType = String(event?.event || "").trim();
  if (eventType !== "charge.success") {
    return res.status(200).send("OK");
  }

  const data = event?.data || {};
  const reference = String(data?.reference || "").trim();
  if (!reference) {
    return res.status(200).send("OK");
  }

  const existing = await Order.findOne({ paymentReference: reference });
  if (existing) {
    await markLockProcessed(reference);
    return res.status(200).send("OK");
  }

  const lock = await acquireTransactionLock(reference);
  if (lock?.status === "processed") {
    return res.status(200).send("OK");
  }
  if (lock?.status === "processing") {
    try {
      await createOrderIfNeeded({
        reference,
        metadata: data?.metadata,
        paidAt: data?.paid_at ? new Date(data.paid_at) : new Date(),
      });
      await markLockProcessed(reference);
    } catch (e) {
      await markLockFailed(reference, e);
      // Return 500 so Paystack can retry.
      return res.status(500).send("Webhook processing failed");
    }
  }

  return res.status(200).send("OK");
});
