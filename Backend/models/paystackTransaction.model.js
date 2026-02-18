import mongoose from "mongoose";

const PaystackTransactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["processing", "processed", "failed"],
      default: "processing",
      index: true,
    },
    processedAt: {
      type: Date,
    },
    lastError: {
      type: String,
    },
  },
  { timestamps: true }
);

const PaystackTransaction = mongoose.model(
  "PaystackTransaction",
  PaystackTransactionSchema
);

export default PaystackTransaction;
