import { useEffect, useState } from "react";
import supportKnowledge from "../config/supportKnowledge";

function getKnowledgeReply(input) {
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

  const best = rankedEntries[0]?.entry;
  if (!best) return null;

  return `${best.summary} ${best.details[0]} Read more: ${best.url}`;
}

function getFallbackReply(input, sitemapLinks = []) {
  const knowledgeReply = getKnowledgeReply(input);
  if (knowledgeReply) return knowledgeReply;

  const value = input.toLowerCase();

  const matchingLink = sitemapLinks.find(({ label, url }) =>
    `${label} ${url}`.toLowerCase().includes(value),
  );

  if (matchingLink) {
    return `You can find that here: ${matchingLink.label} - ${matchingLink.url}`;
  }

  if (/wellness|health|natural|product|consult/i.test(value)) {
    return "We can help with wellness products, healthy-living education, and available wellness-service consultations. Please share what you would like to learn about.";
  }

  if (/delivery|shipping|nationwide|order/i.test(value)) {
    return "For product delivery or service availability, please contact Easy Life support on WhatsApp at +2348037757718 or use the Contact page.";
  }

  if (/return|refund|policy|exchange/i.test(value)) {
    return "You can review our returns and refund policy on the website, or contact us directly for order-specific help. Our support email is support@easylifewellnesshub.com.";
  }

  if (/price|cost|quote|estimate/i.test(value)) {
    return "Pricing and availability depend on the product, service, or program. Please share what you are interested in and Easy Life support will guide you.";
  }

  if (/contact|support|whatsapp|email|call/i.test(value)) {
    return "You can contact us through WhatsApp at +2348037757718, email us at support@easylifewellnesshub.com, or visit our contact page for more options.";
  }

  if (/collection|training|membership|leadership|business/i.test(value)) {
    return "Easy Life offers wellness products, practical training, leadership development, mentorship, and community opportunities.";
  }

  return "I can help with wellness products, training, membership, services, delivery, returns, and support. Try asking about wellness, training, or how to contact us.";
}

export default function SupportAssistant() {
  const [sitemapLinks, setSitemapLinks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I’m Easy Life’s support assistant. I can help with wellness products, training, services, delivery, returns, and contact options.",
    },
  ]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetch("/sitemap.xml")
      .then((response) => (response.ok ? response.text() : ""))
      .then((xml) => {
        if (!xml) return;
        const documentXml = new DOMParser().parseFromString(xml, "application/xml");
        const links = Array.from(documentXml.querySelectorAll("loc")).map((node) => {
          const url = node.textContent || "";
          const path = new URL(url, window.location.origin).pathname;
          const label = path === "/" ? "Easy Life home" : path
            .split("/")
            .filter(Boolean)
            .map((part) => part.replace(/-/g, " "))
            .join(" ");
          return { label, url };
        });
        setSitemapLinks(links);
      })
      .catch(() => setSitemapLinks([]));
  }, []);

  const handleSend = (value) => {
    const message = value.trim();
    if (!message) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: message },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: getFallbackReply(message, sitemapLinks),
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
                {message.text}
              </div>
            ))}
          </div>

          <div className="support-assistant-suggestions">
            {[
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
