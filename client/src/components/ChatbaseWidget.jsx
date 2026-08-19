import { useEffect, useState } from "react";

function getFallbackReply(input) {
  const value = input.toLowerCase();

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

export default function ChatbaseWidget() {
  const [isFallbackActive, setIsFallbackActive] = useState(false);
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
    const chatbotId = import.meta.env.VITE_CHATBASE_CHATBOT_ID;

    if (!chatbotId) {
      setIsFallbackActive(true);
      return;
    }

    if (document.getElementById("chatbase-init-script")) {
      return;
    }

    const snippet = `
      (function(){
        if(!window.chatbase || window.chatbase("getState") !== "initialized"){
          window.chatbase = (...arguments) => {
            if(!window.chatbase.q){
              window.chatbase.q = [];
            }
            window.chatbase.q.push(arguments);
          };
          window.chatbase = new Proxy(window.chatbase, {
            get(target, prop) {
              if(prop === "q") return target.q;
              return (...args) => target(prop, ...args);
            }
          });
        }

        const onLoad = function(){
          const script = document.createElement("script");
          script.src = "https://www.chatbase.co/embed.min.js";
          script.id = "${chatbotId}";
          script.domain = "www.chatbase.co";
          document.body.appendChild(script);
        };

        if(document.readyState === "complete"){
          onLoad();
        } else {
          window.addEventListener("load", onLoad, { once: true });
        }
      })();
    `;

    const initScript = document.createElement("script");
    initScript.id = "chatbase-init-script";
    initScript.textContent = snippet;
    document.body.appendChild(initScript);

    const fallbackTimer = window.setTimeout(() => {
      try {
        const state = window.chatbase?.("getState");
        if (state !== "initialized") {
          setIsFallbackActive(true);
        }
      } catch {
        setIsFallbackActive(true);
      }
    }, 3000);

    return () => {
      window.clearTimeout(fallbackTimer);
      const init = document.getElementById("chatbase-init-script");
      if (init) init.remove();

      const widget = document.getElementById(chatbotId);
      if (widget) widget.remove();
    };
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
        text: getFallbackReply(message),
      },
    ]);
    setDraft("");
  };

  if (!isFallbackActive) {
    return null;
  }

  return (
    <div className="chatbase-fallback">
      <button
        type="button"
        className="chatbase-fallback-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open support assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbase-fallback-panel">
          <div className="chatbase-fallback-header">
            <strong>Easy Life Support</strong>
            <span>Online help</span>
          </div>

          <div className="chatbase-fallback-body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbase-fallback-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbase-fallback-suggestions">
            {[
              "What wellness products do you offer?",
              "What training is available?",
              "How can I join the community?",
              "How do I contact support?",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="chatbase-fallback-chip"
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="chatbase-fallback-input-row">
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
