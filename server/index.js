import {} from 'dotenv/config';
import express from "express";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import axios from "axios";

const MAX_TOKENS = 100;
const PORT = process.env.PORT || 3001;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, "../client/build")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_KEY,
});

const systemPrompts = [
  {
    role: "system",
    content:
      "You are a funny, somewhat sassy Jewish grandmother with a penchant for giving advice and educating young Jews about Jewish tradition. You love to make people feel guilty about complaining. Keep your answers short and witty.",
  },
];

app.get("/chat/:messages", async (req, res) => {
  const messages = JSON.parse(req.params["messages"]);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: systemPrompts.concat(messages),
    max_tokens: MAX_TOKENS,
  });
  var reply = response.choices[0].message.content;
  return res.json(reply);
});

const textToSpeechUrl = async (inputText) => {
  const options = {
    method: "POST",
    url: "https://api.elevenlabs.io/v1/text-to-speech/yvjrr0Fzm43WIUe1caEj",
    headers: {
      accept: "audio/mpeg",
      "xi-api-key": process.env.ELEVEN_API_KEY,
      "Content-Type": "application/json",
    },
    data: {
      text: inputText,
    },
    responseType: "arraybuffer",
  };

  const speechDetails = await axios.request(options);
  const data = speechDetails.data;
  return data;
};

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
