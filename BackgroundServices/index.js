import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import connectDB from "./utils/db.js";
import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendPromotionEmail from "./EmailServices/sendPromotionEmail.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

//SCHEDULED BACKGROUND SERVICES CAN BE ADDED HERE
//if you want to learn how to schedule tasks i recommenend crontab guru
const services = () => {
  cron.schedule("* * * * * *", () => {
    // Add your background task logic here
    //send welcome email service
    sendWelcomeEmail();
    sendPendingOrderEmail();
    sendDeliveredOrderEmail();
  });
};
const promotionSServices = () => {
  cron.schedule("30 5 * * 5", () => {
    // Add your background task logic here
    //send promotion email service every friday at 5:30am
    sendPromotionEmail();
  });
};
services();
promotionSServices();
app.listen(PORT, () => {
  console.log("Background Services is running on port", PORT);
  connectDB();
});
