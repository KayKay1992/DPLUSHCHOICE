import nodemailer from "nodemailer";

const sendMail = async (messageOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  await transporter.sendMail(messageOptions);
};

export default sendMail;
