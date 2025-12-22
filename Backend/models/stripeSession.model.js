import mongoose from "mongoose";

const StripeSessionSchema = new mongoose.Schema(
  {
    sessionId: {
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

const StripeSession = mongoose.model("StripeSession", StripeSessionSchema);
export default StripeSession;
