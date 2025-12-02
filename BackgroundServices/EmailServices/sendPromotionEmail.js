import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

dotenv.config();

const sendPromotionEmail = async () => {
  const users = await User.find(); // Fetch users 
    const products = await Product.aggregate([
        { $sample: { size: 5 } }
    ]); // Fetch top 5 products
    for (let user of users) {
      ejs.renderFile(
        "templates/promotion.ejs",
        {
          name: user.name,
          products: products,
        },
        async (err, data) => {
          let messageOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: " Top Products Just for You! ",
            html: data,
            attachments: [
              {
                filename: "logo.jpg",
                path: path.resolve(__dirname, "../assets/logo.jpg"),
                cid: "logo",
              },
            ],
          };
          try {
            await sendMail(messageOptions);
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
};

export default sendPromotionEmail;