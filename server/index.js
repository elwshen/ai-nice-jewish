import express from "express";
import path from "path";
import OpenAI from 'openai';
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 3001;
const app = express();
var messageHistory = [];
const MAX_MESSAGE_HISTORY_LENGTH = 15;
const systemPrompts = [
  {
    role: "system",
    content:
      "You are a funny, nice, somewhat sarcastic Jewish content creator aiming to support other nice people, primarily Jews. Keep your answers short and witty.",
  },
];

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-UB5CSjHVksfT9TnoeLpQYOhZ",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/chat/prompt/:input", async (req, res) => {
  const prompt = req.params["input"];
  messageHistory.push({ role: "user", content: prompt });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: systemPrompts.concat(messageHistory),
    max_tokens: 70,
  });
  var reply = response.choices[0].message.content;
  messageHistory.push({ role: "assistant", content: reply });

  // truncate message history if it gets too long
  if (messageHistory.length > MAX_MESSAGE_HISTORY_LENGTH) {
    messageHistory.shift();
  }
  return res.json(reply);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
