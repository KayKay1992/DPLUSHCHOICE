import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import Order from "../models/order.model.js";

dotenv.config();

const sendDeliveredOrderEmail = async () => {
  const orders = await Order.find({ status: 2 }); // Fetch orders with status 2 (delivered)

  if (orders.length > 0) {
    for (let order of orders) {
      ejs.renderFile(
        "templates/deliveveredorder.ejs",
        {
          name: order.name,
          products: order.products,
        },
        async (err, data) => {
          let messageOptions = {
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
          try {
            await sendMail(messageOptions);
            await Order.findByIdAndUpdate(order._id, { $set: { status: 3 } }); // Update order status to 3 (delivered)
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }
};

export default sendDeliveredOrderEmail;
