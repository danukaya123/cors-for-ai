import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const WORKER_URL = "https://quizontal-ai-image.educatelux1.workers.dev";
const API_KEY = process.env.API_KEY || "danukaandkusalani";

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const workerResponse = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!workerResponse.ok) {
      const text = await workerResponse.text();
      return res.status(workerResponse.status).json({ error: text });
    }

    const buffer = await workerResponse.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/", (req, res) => res.send("Quizontal AI Backend is running!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
