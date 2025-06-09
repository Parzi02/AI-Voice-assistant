import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "assistant", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Call backend API here
  const fetchAssistantReply = async (message) => {
    try {
      // Change URL to your backend endpoint
      const response = await fetch("http://localhost:5000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.audio) {
        const audio = new Audio("data:audio/wav;base64," + data.audio);
        audio.play();
      }

      return data.reply || "Sorry, I did not understand.";
    } catch (error) {
      console.error("Error fetching assistant reply:", error);
      return "Sorry, something went wrong. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    const userMessage = input;
    setInput("");

    // Fetch assistant reply from backend
    const reply = await fetchAssistantReply(userMessage);

    setMessages((msgs) => [...msgs, { from: "assistant", text: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chatbot</div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.from === "user" ? "user-message" : "assistant-message"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          className="textarea"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
