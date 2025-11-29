//kenneth1992
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  const DB = process.env.DB;
  try {
    const conn = await mongoose.connect(DB).then(() => {
      console.log("MongoDB connection established");
    });
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};
export default connectDB;
