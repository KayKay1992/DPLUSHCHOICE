import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

dotenv.config();

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendPromotionEmail = async () => {
  const users = await User.find(); // Fetch all users
  const products = await Product.aggregate([{ $sample: { size: 5 } }]); // Fetch 5 random products

  for (let user of users) {
    try {
      const data = await ejs.renderFile(
        path.resolve(__dirname, "../templates/promotion.ejs"),
        { name: user.name, products: products }
      );
      const messageOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Top Products Just for You!",
        html: data,
        attachments: [
          {
            filename: "logo.jpg",
            path: path.resolve(__dirname, "../assets/logo.jpg"),
            cid: "logo",
          },
        ],
      };
      await sendMail(messageOptions);
    } catch (error) {
      console.log("sendPromotionEmail error:", error);
    }
  }
};

export default sendPromotionEmail;
