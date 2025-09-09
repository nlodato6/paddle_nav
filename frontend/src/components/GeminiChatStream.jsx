import { useState, useEffect } from "react";

export default function GeminiChatStream() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);

  return (
    <div className="p-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 my-1 rounded ${
            msg.sender === "bot" ? "bg-light text-dark" : "bg-primary text-white"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
