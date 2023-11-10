import express from "express";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const MAX_TOKENS = 70;

const PORT = process.env.PORT || 3001;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, "../client/build")));

const INITIAL_ASSISTANT_PROMPT =
  "Hi, I'm the Nice Jewish AI. You can ask me anything about Judaism and I’ll do my best to answer you.";

const systemPrompts = [
  {
    role: "system",
    content:
      "You are a funny, nice, somewhat sarcastic Jewish content creator aiming to support other nice people, primarily Jews. Keep your answers short and witty.",
  },
];

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-qaD3EOu435lUlsrNMjtD2i7k",
});

// app.get("/chat/initial-prompt", async (req, res) => {
//   messageHistory.push({ role: "assistant", content: INITIAL_ASSISTANT_PROMPT });
//   return res.json(INITIAL_ASSISTANT_PROMPT);
// });

app.get("/chat/:messages", async (req, res) => {
  const messages = JSON.parse(req.params["messages"]);
  console.log(req.params["messages"]);
  console.log(messages);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: systemPrompts.concat(messages),
    max_tokens: MAX_TOKENS,
  });
  var reply = response.choices[0].message.content;
  console.log(reply);

  return res.json(reply);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
