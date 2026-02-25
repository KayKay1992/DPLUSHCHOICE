import dotenv from "dotenv";
import connectDB from "../utils/db.js";
import sendWelcomeEmail from "../EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "../EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "../EmailServices/sendDeliveredOrderEmail.js";

// Load env when running locally; on Vercel env vars are injected.
dotenv.config();

/**
 * Vercel Cron handler — runs every 5 minutes.
 * Vercel automatically sends: Authorization: Bearer <CRON_SECRET>
 */
export default async function handler(req, res) {
  // Protect the endpoint so only Vercel cron (or your manual test) can trigger it
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectDB();
    await sendWelcomeEmail();
    await sendPendingOrderEmail();
    await sendDeliveredOrderEmail();
    return res.status(200).json({ ok: true, ran: new Date().toISOString() });
  } catch (error) {
    console.error("Background cron failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
