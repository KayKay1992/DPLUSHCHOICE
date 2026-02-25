import dotenv from "dotenv";
import connectDB from "../utils/db.js";
import sendPromotionEmail from "../EmailServices/sendPromotionEmail.js";

dotenv.config();

/**
 * Vercel Cron handler — runs every Friday at 5:30am.
 * Vercel automatically sends: Authorization: Bearer <CRON_SECRET>
 */
export default async function handler(req, res) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectDB();
    await sendPromotionEmail();
    return res.status(200).json({ ok: true, ran: new Date().toISOString() });
  } catch (error) {
    console.error("Promotion cron failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
