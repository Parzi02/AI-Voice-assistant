import os
from dotenv import load_dotenv
from deepgram import DeepgramClient, SpeakOptions
from playsound import playsound

load_dotenv()

class TTS:
    def __init__(self):
        # self.filename is no longer needed as it will be passed to speak method
        pass
    
    def speak(self, text, file_path):
        try:
            # STEP 1: Create a Deepgram client using the API key from environment variables
            deepgram = DeepgramClient(api_key=os.getenv("DEEPGRAM_API_KEY"))

            # STEP 2: Configure the options (such as model choice, audio configuration, etc.)
            options = SpeakOptions(
                model="aura-asteria-en",
                encoding="linear16",
                container="wav"
            )

            # STEP 3: Call the save method on the speak property, using the provided file_path
            SPEAK_OPTIONS = {"text": text}
            response = deepgram.speak.v("1").save(file_path, SPEAK_OPTIONS, options)

            # Removed: playsound(self.filename) as audio will be sent to frontend

        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    tts = TTS()
    tts.speak("Hello, how can I help you today?")
