import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },
    whatinbox: {
      type: String,
    },
    img: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    wholesalePrice: {
      type: Number,
    },
    wholesaleMinimumQuantity: {
      type: Number,
    },
    categories: {
      type: Array,
    },
    concern: {
      type: Array,
    },
    brand: {
      type: String,
    },
    skinType: {
      type: Array,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    ratings: [
      {
        star: { type: String },
        name: { type: String },
        comment: { type: String },
        postedBy: { type: String },
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.index({ "$**": "text" });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
