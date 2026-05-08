import { Resend } from "resend";

const sendMail = async ({ from, to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from, to, subject, html });
};

export default sendMail;
