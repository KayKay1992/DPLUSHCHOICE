import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

const isAdminUser = (user) => {
  const role = String(user?.role || "").toLowerCase();
  return role === "admin" || role === "superadmin" || role === "super-admin";
};

const clampShippingStatus = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < 0) return 0;
  if (n > 3) return 3;
  return Math.trunc(n);
};

const resolveShippingStatus = (body) => {
  // Prefer new field
  if (body?.shippingStatus !== undefined) {
    return clampShippingStatus(body.shippingStatus);
  }

  // Backward compatibility: old admin UI toggled `status: 0/1`.
  if (body?.status !== undefined) {
    const s = Number(body.status);
    if (s === 1) return 3; // delivered
    if (s === 0) return 0; // pending
  }

  return null;
};

//Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { products, userId } = req.body;

  // Check stock availability and update stock for each product
  for (const product of products) {
    const dbProduct = await Product.findById(product._id || product.id);

    if (!dbProduct) {
      res.status(404);
      throw new Error(`Product ${product.title} not found`);
    }

    const requestedQuantity = product.quantity || 1;
    const availableStock = dbProduct.stock || 0;

    if (availableStock < requestedQuantity) {
      res.status(400);
      throw new Error(
        `Insufficient stock for ${product.title}. Available: ${availableStock}, Requested: ${requestedQuantity}`
      );
    }

    // Reduce stock
    await Product.findByIdAndUpdate(
      dbProduct._id,
      { $inc: { stock: -requestedQuantity } },
      { new: true }
    );
  }

  // Create the order after stock validation and reduction
  // New orders should be pending until an admin marks them completed/delivered.
  const newOrder = new Order({
    ...req.body,
    status: 0,
  });
  const order = await newOrder.save();

  if (order) {
    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong while creating order");
  }
});

//Update Order
export const updateOrder = asyncHandler(async (req, res) => {
  // Only admins should update orders (status/tracking etc).
  if (!isAdminUser(req.user)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const existingOrder = await Order.findById(req.params.id);
  if (!existingOrder) {
    res.status(404);
    throw new Error("Order not found");
  }

  const shippingStatus = resolveShippingStatus(req.body);
  const updateData = { ...req.body };

  if (shippingStatus !== null) {
    updateData.shippingStatus = shippingStatus;
    // Keep legacy `status` in sync so existing UI keeps working.
    updateData.status = shippingStatus === 3 ? 1 : 0;

    const now = new Date();
    if (shippingStatus >= 1 && !existingOrder.processingAt) {
      updateData.processingAt = now;
    }
    if (shippingStatus >= 2 && !existingOrder.shippedAt) {
      updateData.shippedAt = now;
    }
    if (shippingStatus >= 3 && !existingOrder.deliveredAt) {
      updateData.deliveredAt = now;
    }
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );
  if (updatedOrder) {
    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder,
    });
  } else {
    res.status(404);
    throw new Error("Something went wrong while updating order");
  }
});

//Delete Order
export const deleteOrder = asyncHandler(async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (deletedOrder) {
    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder,
    });
  } else {
    res.status(404);
    throw new Error("Something went wrong while deleting order");
  }
});

// Get User Orders (FIXED)
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    userId: req.params.userId,
  }).sort({ createdAt: -1 });

  res.status(200).json(orders);
});

// Get Single Order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//Get All Orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("Something went wrong while fetching orders");
  }
});
