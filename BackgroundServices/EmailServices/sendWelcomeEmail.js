import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";

dotenv.config();

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendWelcomeEmail = async () => {
  const users = await User.find({ status: 0 }); // Fetch users with status 0 (new users)

  if (users.length > 0) {
    for (let user of users) {
      try {
        const data = await ejs.renderFile(
          path.resolve(__dirname, "../templates/welcome.ejs"),
          { name: user.name }
        );
        const messageOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Welcome to D' Plush Choice",
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
        await User.findByIdAndUpdate(user._id, { $set: { status: 1 } }); // Update user status to 1 (welcomed)
      } catch (error) {
        console.log("sendWelcomeEmail error:", error);
      }
    }
  }
};

export default sendWelcomeEmail;
