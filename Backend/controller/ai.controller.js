import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const generateDescription = async (req, res) => {
  const { title } = req.body;
  const image = req.file;

  // Upload image to a cloud service and get URL
  // For demo, assume imageUrl is available
  const imageUrl = "URL_FROM_CLOUD_UPLOAD";

  const prompt = `Write a short, enticing product description for a \"${title}\" using this image: ${imageUrl}`;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are a product description generator.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const description = response.data.choices[0].message.content;
    res.json({ description });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate description" });
  }
};
