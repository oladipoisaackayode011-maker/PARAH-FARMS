// ===== PARAH AI Chat Widget (powered by Firebase AI Logic + Gemini) =====
// No custom backend server needed — this calls Gemini directly through
// the PARAH INTEGRATED FARM'S Firebase project using the free Gemini
// Developer API (Spark plan). Reuses the same project as admin.html.

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js";

// Same config as admin.html. Keep this in sync if it ever changes.
const firebaseConfig = {
  apiKey: "AIzaSyDftNbRLydAWxC6p0xLmu2lhT3izgGvvns",
  authDomain: "parah-integrated-farm-s.firebaseapp.com",
  projectId: "parah-integrated-farm-s",
  storageBucket: "parah-integrated-farm-s.firebasestorage.app",
  messagingSenderId: "529379479635",
  appId: "1:529379479635:web:5234731e663c529e3676a6"
};

// Avoid re-initializing if another script (like a future auth.js) already did.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  model: "gemini-3.6-flash",
  systemInstruction:
    "You are PARAH AI, a friendly assistant for PARAH INTEGRATED FARM'S, a poultry and farm-products business in Nigeria. " +
    "You help visitors with questions about products, prices, ordering, jobs, and contact info. " +
    "Here is what you should know:\n" +
    "PRODUCTS:\n" +
    "- Fresh Table Eggs: ₦5,500–₦6,500 per crate (30 eggs), price varies by size\n" +
    "- Live Broiler Chickens: ₦9,500 per bird (avg. 3kg)\n" +
    "- Rabbit: ₦8,000 per rabbit, vaccinated and certified\n" +
    "- Organic Poultry Manure: ₦3,000 per 50kg bag\n" +
    "ORDERING: Customers order through the 'Order' page on the website (order.html), for pickup or delivery.\n" +
    "JOBS: Job seekers can apply through the 'Jobs' page (jobs.html).\n" +
    "CONTACT: Phone 08067033288, 08062301723, 07049069026; WhatsApp available; email info@parahventures.com.\n" +
    "Keep replies short, warm, and helpful. If you don't know something specific (like live stock availability), " +
    "politely suggest the visitor contact the farm directly or place an order to confirm."
});

const aiBtn = document.getElementById("parah-ai-btn");
const aiChat = document.getElementById("parah-ai-chat");
const closeBtn = document.getElementById("close-parah-ai");
const sendBtn = document.getElementById("parah-ai-send");
const input = document.getElementById("parah-ai-input");
const messages = document.getElementById("parah-ai-messages");

aiBtn.addEventListener("click", () => {
  aiChat.classList.toggle("hidden");
  if (!aiChat.classList.contains("hidden")) {
    input.focus();
    if (!messages.dataset.greeted) {
      addMessage("👋 Hello! I'm PARAH AI. Ask me about our products, prices, or how to order!", "ai");
      messages.dataset.greeted = "1";
    }
  }
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
  div.className = sender === "user" ? "parah-ai-msg user" : "parah-ai-msg";
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
    console.error("PARAH AI error:", err);
    typingDiv.textContent = "⚠️ Couldn't reach the AI right now. Please try again later.";
  }
}
