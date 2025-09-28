import express from "express";
import fetch from "node-fetch"; // if using Node 18+, native fetch works
import cors from "cors";

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

const WORKER_URL = "https://quizontal-ai-image.educatelux1.workers.dev";
const API_KEY = "danukaandkusalani";

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CORS proxy running on port ${PORT}`));
