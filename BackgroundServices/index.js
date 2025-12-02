import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

//SCHEDULED BACKGROUND SERVICES CAN BE ADDED HERE
//if you want to learn how to schedule tasks i recommenend crontab guru
const services = () => {
    cron.schedule("* * * * * *", () => {
        // Add your background task logic here
    });
};
services();
app.listen(PORT, () => {
    console.log("Background Services is running on port", PORT);
    connectDB();
});