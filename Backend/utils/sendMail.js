import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const configuration = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const sendMail = async (messageOptions) => {
  const transporter = nodemailer.createTransport(configuration);
  await transporter.verify();
  await transporter.sendMail(messageOptions);
};

export default sendMail;
