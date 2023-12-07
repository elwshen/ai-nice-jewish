import React from "react";
import "./App.css";
import { useState } from "react";
import axios, { ResponseType } from "axios";

const MAX_MESSAGE_HISTORY_LENGTH = 5;

interface Message {
  role: string;
  content: string;
}
const INITIAL_ASSISTANT_PROMPT =
  "Hi, I'm the Nice Jewish Bubbe. You can ask me anything about Judaism and I’ll do my best to answer you.";

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_ASSISTANT_PROMPT },
  ]);
  const [AITyping, setAITyping] = useState<boolean>(false);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const scrollToBottom = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  React.useEffect(() => scrollToBottom("messages-box"), [messages]);

  window.onresize = function (_event) {
    setWindowHeight(window.innerHeight);
  };

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

  React.useEffect(() => {
    const footer = document.getElementById("chat-field");
    const videoPlayer = document.getElementById("talk-video");
    const videoHeight = videoPlayer ? videoPlayer.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    document.documentElement.style.setProperty(
      "--messages-height",
      `${windowHeight - (videoHeight + footerHeight + 48)}px`
    );
  }, [windowHeight]);

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
          await textToSpeech(res);
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

  const textToSpeech = async (inputText: string) => {
    const options = {
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/WruJHDAF1bWs03CrrotN",
      headers: {
        accept: "audio/mpeg",
        "xi-api-key": process.env.REACT_APP_ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        text: inputText,
      },
      responseType: "arraybuffer" as ResponseType,
    };
    const speechDetails = await axios.request(options);
    const data = speechDetails.data;
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
  };

  React.useEffect(() => {
    const audioPlayer = document.getElementById("audio");
    if (audioPlayer) {
      (audioPlayer as HTMLAudioElement).load();
      (audioPlayer as HTMLAudioElement).play();
    }
  }, [audioUrl]);

  const onAudioPlay = () => {
    const videoPlayer = document.getElementById("talk-video");
    if (videoPlayer) {
      (videoPlayer as HTMLVideoElement).play();
    }
  };

  const onAudioPause = () => {
    const videoPlayer = document.getElementById("talk-video");
    if (videoPlayer) {
      (videoPlayer as HTMLVideoElement).pause();
    }
  };

  return (
    <div className="App">
      <center>
        <video
          id="talk-video"
          height="150"
          loop={true}
          playsInline
          autoPlay
        >
          <source src="/assets/bubbie3.mp4" />
        </video>
      </center>
      {audioUrl && (
        <audio autoPlay id="audio" onPlay={onAudioPlay} onPause={onAudioPause}>
          <source id="audio-src" src={audioUrl} type="audio/mpeg"></source>
        </audio>
      )}
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
