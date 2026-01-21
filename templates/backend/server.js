console.log("ENV KEY =", process.env.OPENAI_API_KEY);
// 🔹 dotenv sabse upar
import dotenv from "dotenv";
dotenv.config();

// 🔹 baaki imports
import express from "express";
import cors from "cors";
import OpenAI from "openai";

// 🔹 test log (temporary)
console.log("API KEY =", process.env.OPENAI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔹 test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 🔹 AI caption route
app.post("/generate-caption", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Generate a short catchy caption." },
        { role: "user", content: prompt }
      ],
      max_tokens: 30
    });

    res.json({ caption: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI caption error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
