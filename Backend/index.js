import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config();

//create server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
