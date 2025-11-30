import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

//create product
export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await new Product(req.body);
  const product = await newProduct.save();

  if (product) {
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

//update product
export const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (updatedProduct) {
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (deletedProduct) {
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//get single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let qSearch = req.query.search;

  let products;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
  } else if (qCategory) {
    products = await Product.find({
      categories: {
        $in: [qCategory],
      },
    });
  } else if (qSearch) {
    products = await Product.find({
      $text: {
        $search: qSearch,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }
});

//Rating product
export const ratingProduct = asyncHandler(async (req, res) => {
  const { star, name, comment, postedBy } = req.body;

  if (star && name && comment && postedBy) {
    const postedBy = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ratings: {
            star,
            name,
            comment,
            postedBy,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Rating added successfully",
      postedBy,
    });
  } else {
    res.status(400);
    throw new Error("All fields are required for rating");
  }
});
