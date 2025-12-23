import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

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
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
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
