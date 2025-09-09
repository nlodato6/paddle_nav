// src/components/FloatingChat.jsx
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { generateGeminiText } from "../api/authApi";


export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { user: null, bot: "Hello! How can I help you today?" }
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
      setChatMessages(prev => [
        ...prev.map(msg => (msg.bot === null ? { ...msg, bot: aiResponse } : msg))
      ]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setChatMessages(prev => [
        ...prev.map(msg => (msg.bot === null ? { ...msg, bot: "Error: could not get response." } : msg))
      ]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="card shadow"
          style={{
            width: "300px",
            height: "400px",
            position: "fixed",
            bottom: "70px",
            right: "20px",
            zIndex: 1050,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            Chat with Gemini
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={toggleChat}
            >
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div
            className="card-body overflow-auto flex-grow-1"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {chatMessages.map((msg, index) => (
              <div key={index}>
                {msg.user && <div className="text-end"><span className="badge bg-primary">{msg.user}</span></div>}
                {msg.bot && <div className="text-start"><span className="badge bg-secondary">{msg.bot}</span></div>}
              </div>
            ))}
          </div>

          {/* Input field */}
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

      {/* Floating "?" Button */}
      <button
        type="button"
        className="btn btn-primary rounded-circle shadow"
        style={{
          position: "fixed",
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
