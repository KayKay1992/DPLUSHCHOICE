import { Resend } from "resend";

const sendMail = async ({ from, to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error("Resend error:", JSON.stringify(error));
    throw new Error(error.message || "Failed to send email");
  }
  return data;
};

export default sendMail;
