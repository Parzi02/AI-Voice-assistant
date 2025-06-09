import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from src.agents.agent import Agent
from src.tools.calendar.calendar_tool import CalendarTool
from src.tools.contacts import AddContactTool, FetchContactTool
from src.tools.emails.emailing_tool import EmailingTool
from src.tools.search import SearchWebTool, KnowledgeSearchTool
from src.speech_processing.conversation_manager import ConversationManager
from src.prompts.prompts import assistant_prompt
from dotenv import load_dotenv
from src.speech_processing.text_to_speech import TTS

load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Message(BaseModel):
    message: str

# Choose any model with LiteLLM
model = "groq/llama3-70b-8192"

# agent tools
tools_list = [
    CalendarTool,
    AddContactTool,
    FetchContactTool,
    EmailingTool,
    SearchWebTool,
    # KnowledgeSearchTool
]

# Initiate the sale agent
agent = Agent("Assistant Agent", model, tools_list, system_prompt=assistant_prompt)
manager = ConversationManager(agent)

@app.post("/api/message")
async def handle_message(message: Message):
    print(f"Received message from frontend: {message.message}")
    # Process the message using the agent's invoke method
    reply = agent.invoke(message.message)

    # Convert reply to speech
    tts = TTS()
    audio_file_path = "output.wav"  # Ensure this path is writable by the server
    tts.speak(reply, audio_file_path)

    # Read the audio file and encode it to base64
    import base64
    with open(audio_file_path, "rb") as audio_file:
        encoded_audio = base64.b64encode(audio_file.read()).decode("utf-8")

    return {"reply": reply, "audio": encoded_audio}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)