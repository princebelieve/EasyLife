const express = require("express");
const knowledge = require("../config/supportBotKnowledge");

const router = express.Router();
const requests = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 40;

function rateLimited(req) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const recent = (requests.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  requests.set(key, recent);
  return false;
}

router.post("/answer", (req, res) => {
  if (rateLimited(req)) return res.status(429).json({ message: "Please wait a moment before sending another question." });
  const question = String(req.body?.question || "").trim().toLowerCase().slice(0, 500);
  if (!question) return res.status(400).json({ message: "Enter a question first." });

  const best = knowledge
    .map((entry) => ({ entry, score: entry.keywords.reduce((score, keyword) => score + (question.includes(keyword) ? keyword.split(" ").length : 0), 0) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!best?.score) return res.json({ answer: "I can help with products, payments, receipt upload, delivery, returns, distributor applications, training, and account access. Please try one of those topics, or use WhatsApp for order-specific help." });
  return res.json({ answer: best.entry.answer, link: best.entry.link || "", linkLabel: best.entry.linkLabel || "" });
});

module.exports = router;
