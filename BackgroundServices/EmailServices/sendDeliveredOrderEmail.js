import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import Order from "../models/order.model.js";

dotenv.config();

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendDeliveredOrderEmail = async () => {
  const orders = await Order.find({ status: 2 }); // Fetch orders with status 2 (delivered)

  if (orders.length > 0) {
    for (let order of orders) {
      try {
        const data = await ejs.renderFile(
          path.resolve(__dirname, "../templates/deliveveredorder.ejs"),
          { name: order.name, products: order.products }
        );
        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "Your Order Has Been Delivered!",
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
        await Order.findByIdAndUpdate(order._id, { $set: { status: 3 } }); // Update order status to 3 (delivered)
      } catch (error) {
        console.log("sendDeliveredOrderEmail error:", error);
      }
    }
  }
};

export default sendDeliveredOrderEmail;
