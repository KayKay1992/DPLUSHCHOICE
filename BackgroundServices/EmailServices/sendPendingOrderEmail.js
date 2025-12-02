import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import Order from "../models/order.model.js";

dotenv.config();

const sendPendingOrderEmail = async () => {
    const orders = await Order.find({ status: 0 }); // Fetch orders with status 0 (pending)

    if (orders.length > 0) {
        for (let order of orders) {
            ejs.renderFile(
                "templates/pendingorder.ejs",
                {
                   name: order.name, 
                   products: order.products,
                },
                async (err, data) => {
                    let messageOptions = {
                        from: process.env.EMAIL,
                        to: order.email,
                        subject: "Your Order has been Received and its shipping soon",
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
                        await Order.findByIdAndUpdate(order._id, { $set: { status: 1 } }); // Update order status to 1 (shipped)
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        }
    }
};

export default sendPendingOrderEmail;