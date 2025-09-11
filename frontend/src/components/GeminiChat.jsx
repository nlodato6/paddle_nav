// src/components/FloatingChat.jsx
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { generateGeminiText } from "../api/authApi";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { user: null, bot: "Hello! How can I help you today?" },
  ]);

  const toggleChat = () => setOpen(!open);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setChatMessages([...chatMessages, { user: userMessage, bot: null }]);
    setInputValue("");

    try {
      const aiResponse = await generateGeminiText(userMessage);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.bot === null ? { ...msg, bot: aiResponse } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.bot === null
            ? { ...msg, bot: "Error: could not get response." }
            : msg
        )
      );
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="card shadow position-fixed d-flex flex-column"
          style={{
            width: "300px",
            height: "400px",
            bottom: "70px",
            right: "20px",
            zIndex: 1050,
          }}
        >
          {/* Header */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span>Chat with Gemini</span>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={toggleChat}
            ></button>
          </div>

          {/* Messages */}
          <div className="card-body overflow-auto flex-grow-1 d-flex flex-column gap-2">
          {chatMessages.map((msg, index) => (
            <div key={index}>
              {msg.user && (
                <div className="text-end">
                  <div
                    className="alert alert-primary d-inline-block text-break mb-1 py-1 px-2"
                    style={{ maxWidth: "80%", whiteSpace: "pre-wrap" }}
                  >
                    {msg.user}
                  </div>
                </div>
              )}
              {msg.bot && (
                <div className="text-start">
                  <div
                    className="alert alert-secondary d-inline-block text-break mb-1 py-1 px-2"
                    style={{ maxWidth: "80%", whiteSpace: "pre-wrap" }}
                  >
                    {msg.bot}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>


          {/* Input */}
          <div className="card-footer">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        className="btn btn-primary rounded-circle shadow position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          fontSize: "24px",
          zIndex: 1050,
        }}
        onClick={toggleChat}
      >
        ?
      </button>
    </>
  );
}
