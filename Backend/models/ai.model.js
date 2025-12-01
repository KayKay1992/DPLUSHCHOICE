import mongoose from "mongoose";
const aiDescriptionSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("AIDescription", aiDescriptionSchema);
