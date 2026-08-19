import { useState } from "react";
import { Link } from "react-router-dom";
import supportKnowledge from "../config/supportKnowledge";

const intentRules = [
  {
    test: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i,
    reply: { text: "Hello! Welcome to Easy Life Wellness Hub. Are you looking for wellness products, training, membership, support, or a checkup?" },
  },
  {
    test: /\b(thank you|thanks|thank u|appreciate)\b/i,
    reply: { text: "You’re welcome. I’m here to help you find the right Easy Life information." },
  },
  {
    test: /\b(bye|goodbye|see you|that is all|that's all)\b/i,
    reply: { text: "Thank you for visiting Easy Life Wellness Hub. Have a healthy, strong, and prosperous day!" },
  },
  {
    test: /\b(who are you|what is easy life|tell me about easy life|what do you do)\b/i,
    entry: "about-easy-life",
  },
  {
    test: /\b(join|sign up|signup|register|become a member|membership)\b/i,
    entry: "membership",
  },
  {
    test: /\b(training|learn|leadership|mentor|mentorship|public speaking|financial literacy)\b/i,
    entry: "training-and-leadership",
  },
  {
    test: /\b(network marketing|business opportunity|earn|income|build a team|financial freedom)\b/i,
    entry: "network-marketing",
  },
  {
    test: /\b(product|products|shop|buy|supplement|herbal|tea|personal care)\b/i,
    entry: "wellness-products",
  },
  {
    test: /\b(equipment|device|machine)\b/i,
    entry: "wellness-equipment",
  },
  {
    test: /\b(test|testing|checkup|check up|screening|prevention)\b/i,
    entry: "test-and-checkup",
  },
  {
    test: /\b(delivery|shipping|dispatch|arrive|location|nationwide)\b/i,
    entry: "delivery-and-shipping",
  },
  {
    test: /\b(return|refund|replacement|damaged|defective|wrong item|exchange)\b/i,
    entry: "returns-and-refunds",
  },
  {
    test: /\b(order|cart|checkout|purchase|buying)\b/i,
    entry: "orders-and-cart",
  },
  {
    test: /\b(contact|support|help|whatsapp|phone|email|call|enquiry)\b/i,
    entry: "contact-and-support",
  },
  {
    test: /\b(medical|diagnosis|treatment|doctor|health advice|safe)\b/i,
    entry: "wellness-information",
  },
  {
    test: /\b(privacy|personal data|delete my data|google sign in|account security)\b/i,
    entry: "privacy-and-account-data",
  },
];

function replyFromEntry(entry) {
  return {
    text: `${entry.summary} ${entry.details[0]}`,
    link: { label: `Read more about ${entry.title}`, to: entry.url },
  };
}

function findKnowledgeEntry(input) {
  const value = input.toLowerCase();
  const terms = value.split(/[^a-z0-9]+/).filter((term) => term.length > 2);

  const rankedEntries = supportKnowledge
    .map((entry) => {
      const searchable = [entry.title, entry.summary, ...entry.keywords, ...entry.details]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  return rankedEntries[0]?.entry || null;
}

function getReply(input) {
  const matchedIntent = intentRules.find((rule) => rule.test.test(input));
  if (matchedIntent?.reply) return matchedIntent.reply;

  if (matchedIntent?.entry) {
    const entry = supportKnowledge.find((item) => item.slug === matchedIntent.entry);
    if (entry) return replyFromEntry(entry);
  }

  const knowledgeEntry = findKnowledgeEntry(input);
  if (knowledgeEntry) return replyFromEntry(knowledgeEntry);

  return {
    text: "I can help with wellness products, equipment, testing, training, membership, orders, delivery, returns, and support. Which one would you like to know about?",
  };
}

export default function SupportAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I’m Easy Life’s support assistant. I can help with wellness products, training, services, delivery, returns, and contact options.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const handleSend = (value) => {
    const message = value.trim();
    if (!message) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: message },
      {
        id: Date.now() + 1,
        role: "assistant",
        ...getReply(message),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="support-assistant">
      <button
        type="button"
        className="support-assistant-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open support assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="support-assistant-panel">
          <div className="support-assistant-header">
            <strong>Easy Life Support</strong>
            <span>Online help</span>
          </div>

          <div className="support-assistant-body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`support-assistant-message ${message.role}`}
              >
                <span>{message.text}</span>
                {message.link && (
                  <Link className="support-assistant-link" to={message.link.to} onClick={() => setIsOpen(false)}>
                    {message.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="support-assistant-suggestions">
            {[
              "Hello",
              "What wellness products do you offer?",
              "What training is available?",
              "How can I join the community?",
              "How do I contact support?",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="support-assistant-chip"
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="support-assistant-input-row">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend(draft);
                }
              }}
              placeholder="Ask about products, delivery, or support"
            />
            <button type="button" onClick={() => handleSend(draft)}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
