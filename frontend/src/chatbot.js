import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "assistant", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState(false); // 🆕 Web Speech API toggle
  const messagesEndRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null); // 🆕 Recognition instance

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // 🆕 Initialize Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Optionally auto-send: handleSend();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsRecognizing(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }
  }, []);

  const startSpeechRecognition = () => {
    if (recognitionRef.current && !isRecognizing) {
      recognitionRef.current.start();
      setIsRecognizing(true);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
      setIsRecognizing(false);
    }
  };

  const fetchAssistantReply = async (message) => {
    try {
      const isAudio = message.startsWith("data:audio");
      const url = isAudio
        ? "http://localhost:5000/api/audio"
        : "http://localhost:5000/api/message";
      const body = isAudio
        ? JSON.stringify({ audio: message.split(",")[1] })
        : JSON.stringify({ message });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) throw new Error("Network error");

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          setMessages((msgs) => [...msgs, { from: "user", text: "(Audio Message)" }]);
          const reply = await fetchAssistantReply(base64Audio);
          setMessages((msgs) => [...msgs, { from: "assistant", text: reply }]);
        };
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleSend = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    const userMessage = input;
    setInput("");
    const reply = await fetchAssistantReply(userMessage);
    setMessages((msgs) => [...msgs, { from: "assistant", text: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
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
          placeholder="Type or speak..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
       

        {/* 🆕 Speech-to-text button */}
        <button
          className={`speech-button ${isRecognizing ? "recording" : ""}`}
          onClick={isRecognizing ? stopSpeechRecognition : startSpeechRecognition}
        >
          {isRecognizing ? "Stop" : "Start"}
        </button>

        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
