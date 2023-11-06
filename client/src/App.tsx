import React from "react";
import "./App.css";
import { useState } from "react";

enum Role {
  User,
  Assistant,
}

interface Message {
  role: Role;
  content: string;
}

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [AITyping, setAITyping] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAITyping(true);
    const query = input;
    setInput("");
    setMessages(messages.concat([{ role: Role.User, content: query }]));

    try {
      await fetch(`/chat/prompt/${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((res) => {
          setMessages(
            messages.concat([
              { role: Role.User, content: query },
              { role: Role.Assistant, content: res },
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
      <div className="messages">
        {messages.map((message, index) => (
          <div
            className={`message-bubble ${
              message.role == Role.Assistant ? "ai-message-bubble" : null
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
      <div className="chat-field">
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
      </div>
    </div>
  );
}

export default App;
