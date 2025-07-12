import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const conversationHistory: {
  [sessionId: string]: Array<{ role: string; content: string }>;
} = {};

app.post("/api/chat", async (req, res) => {
  const { prompt, sessionId = "default" } = req.body;

  try {
    if (!conversationHistory[sessionId]) {
      conversationHistory[sessionId] = [];
    }

    conversationHistory[sessionId].push({ role: "user", content: prompt });

    const context = conversationHistory[sessionId]
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      )
      .join("\n");

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: context,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    conversationHistory[sessionId].push({
      role: "assistant",
      content: data.response,
    });
    res.json(data);
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.status(500).json({
      error: "Failed to get response from AI model",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.delete("/api/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params; // Extracts session ID as parameter

  if (conversationHistory[sessionId]) {
    delete conversationHistory[sessionId];
    res.json({ message: "Conversation history cleared" });
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

app.get("/api/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;

  if (conversationHistory[sessionId]) {
    res.json({ history: conversationHistory[sessionId] });
  } else {
    res.json({ history: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
