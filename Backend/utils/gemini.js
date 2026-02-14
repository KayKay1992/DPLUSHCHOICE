import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const key = JSON.parse(
  fs.readFileSync(path.join(__dirname, "gemini-credentials.json"))
);

const genAI = new GoogleGenerativeAI({
  projectId: key.project_id,
  credentials: key,
});

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // best free-tier model
});
