// ===== KSOME AI Chat Widget (powered by Firebase AI Logic + Gemini) =====
// No custom backend server needed — this calls Gemini directly through
// your Firebase project using the free Gemini Developer API (Spark plan).
 
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js";
 
// Reuse the same config as auth.js. Keep this in sync if it ever changes.
const firebaseConfig = {
   apiKey: "AIzaSyC1LV-g2H3yKs_6nbruF1TEbCoV34UX0jI",
  authDomain: "ksome-website.firebaseapp.com",
  projectId: "ksome-website",
  storageBucket: "ksome-website.appspot.com",
  messagingSenderId: "970299265208",
  appId: "1:970299265208:web:870e4de77e51e9032e644d"
};
 
// Avoid re-initializing if another script (like auth.js) already did.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
 
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  model: "gemini-3.6-flash",
  systemInstruction:
    "You are KSOME AI, a friendly assistant for the KSOME Livestreaming & Video Edit Course website. " +
    "Answer questions about the courses, services, booking, and enrollment. Keep replies short and helpful."
});
 
const aiBtn = document.getElementById("ksome-ai-btn");
const aiChat = document.getElementById("ksome-ai-chat");
const closeBtn = document.getElementById("close-ai");
const sendBtn = document.getElementById("send-ai");
const input = document.getElementById("user-message");
const messages = document.getElementById("ai-messages");
 
aiBtn.addEventListener("click", () => {
  aiChat.classList.toggle("hidden");
  if (!aiChat.classList.contains("hidden")) input.focus();
});
 
closeBtn.addEventListener("click", () => {
  aiChat.classList.add("hidden");
});
 
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
 
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "ai-message user" : "ai-message";
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}
 
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
 
  addMessage(text, "user");
  input.value = "";
 
  const typingDiv = addMessage("…", "ai");
 
  try {
    const result = await model.generateContent(text);
    const reply = result.response.text();
    typingDiv.textContent = reply || "Sorry, I didn't get a response.";
  } catch (err) {
    console.error("KSOME AI error:", err);
    typingDiv.textContent = "⚠️ Couldn't reach the AI right now. Please try again later.";
  }
}
 
