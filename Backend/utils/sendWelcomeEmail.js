import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "./sendMail.js";
import User from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendWelcomeEmail = async (user) => {
  try {
    const html = await ejs.renderFile(
      path.resolve(__dirname, "../templates/welcome.ejs"),
      { name: user.name },
    );
    const messageOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Welcome to D' Plush Choice",
      html,
      attachments: [
        {
          filename: "logo.jpg",
          path: path.resolve(__dirname, "../assets/logo.jpg"),
          cid: "logo",
        },
      ],
    };
    await sendMail(messageOptions);
    await User.findByIdAndUpdate(user._id, { $set: { status: 1 } }); // mark as welcomed so cron skips them
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error("sendWelcomeEmail error:", error.message);
  }
};

export default sendWelcomeEmail;
