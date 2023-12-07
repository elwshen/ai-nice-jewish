import React from "react";
import "./App.css";
import { useState } from "react";
import { Avatar } from "./components/Avatar";
import { getTextToSpeechUrl } from "./textToSpeech";
import { useMessagesBoxHeight } from "./useMessagesBoxHeight";

const MAX_MESSAGE_HISTORY_LENGTH = 5;

interface Message {
  role: string;
  content: string;
}
const INITIAL_ASSISTANT_PROMPT =
  "Hi, I'm the Nice Jewish Bubbe. You can ask me anything about Judaism and I’ll do my best to answer you.";

function App() {
  useMessagesBoxHeight();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_ASSISTANT_PROMPT },
  ]);
  const [AITyping, setAITyping] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const scrollToBottom = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };
  React.useEffect(() => scrollToBottom("messages-box"), [messages]);

  const processMessagesForRequest = (
    messageHistory: Message[],
    query: string
  ) => {
    if (messageHistory.length > MAX_MESSAGE_HISTORY_LENGTH) {
      messageHistory = messageHistory.slice(
        messageHistory.length - MAX_MESSAGE_HISTORY_LENGTH
      );
    }
    return encodeURIComponent(
      JSON.stringify(messageHistory.concat([{ role: "user", content: query }]))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAITyping(true);
    const query = input;
    setInput("");
    setMessages(messages.concat([{ role: "user", content: query }]));

    try {
      await fetch(`/chat/${processMessagesForRequest(messages, query)}`)
        .then((res) => res.json())
        .then(async (res) => {
          setAudioUrl(await getTextToSpeechUrl(res));
          setMessages(
            messages.concat([
              { role: "user", content: query },
              { role: "assistant", content: res },
            ])
          );
          setAITyping(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Avatar id="avatar" audioUrl={audioUrl} />
      <div className="messages" id="messages-box">
        {messages.map((message, index) => (
          <div
            className={`message-bubble ${
              message.role == "assistant" ? "ai-message-bubble" : null
            }`}
            key={`${index}_message`}
          >
            {message.content}
          </div>
        ))}
        {AITyping ? (
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        ) : null}
      </div>
      <div id="chat-field" className="chat-field">
        <form onSubmit={handleSubmit}>
          <input
            autoComplete="off"
            placeholder="Message"
            className="chat-field-input"
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            disabled={input.length == 0}
            className="send-chat-button"
            type="submit"
          >
            Send
          </button>
        </form>
        <div className="waitlist-link-container">
          <div className="disclaimer">
            <b>Important:</b> This is new tech, so please be nice and aware that
            it makes mistakes.
          </div>
          <a
            href="https://8xd8buw00js.typeform.com/nicejewish18"
            target="_blank"
            className="waitlist-link"
          >
            Join the Nice Jewish waitlist
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
