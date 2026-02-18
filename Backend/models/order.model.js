import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },

    // Shipping timeline (do not break legacy `status`)
    // shippingStatus: 0=Pending, 1=Processing, 2=Shipped, 3=Delivered
    shippingStatus: {
      type: Number,
      default: 0,
    },
    processingAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },

    // Tracking
    trackingCarrier: {
      type: String,
      default: "",
    },
    trackingNumber: {
      type: String,
      default: "",
    },

    // Payment tracking (Paystack for now; keep generic for future providers)
    paymentProvider: {
      type: String,
      default: "",
      index: true,
    },
    paymentReference: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      default: "",
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
