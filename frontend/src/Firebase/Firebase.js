// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJU-cRmvy7HbEnhVNP8XMgfWLZTvfZ2qU",
  authDomain: "ai-voice-assistant-a28b7.firebaseapp.com",
  projectId: "ai-voice-assistant-a28b7",
  storageBucket: "ai-voice-assistant-a28b7.firebasestorage.app",
  messagingSenderId: "957884184941",
  appId: "1:957884184941:web:acf433302b276ac6210264",
  measurementId: "G-BCFH3VPNP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };