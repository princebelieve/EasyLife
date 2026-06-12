import { useEffect } from "react";

export default function ChatbaseWidget() {
  useEffect(() => {
    const chatbotId = import.meta.env.VITE_CHATBASE_CHATBOT_ID;

    if (!chatbotId) {
      return;
    }

    if (document.getElementById("chatbase-widget-script")) {
      return;
    }

    const configScript = document.createElement("script");
    configScript.textContent = `
      window.chatbaseConfig = {
        chatbotId: "${chatbotId}",
        domain: "https://newbrend.vercel.app"
      };
    `;

    const widgetScript = document.createElement("script");
    widgetScript.id = "chatbase-widget-script";
    widgetScript.src = "https://www.chatbase.co/widget/Widget.js";
    widgetScript.defer = true;

    document.head.appendChild(configScript);
    document.head.appendChild(widgetScript);

    return () => {
      const existing = document.getElementById("chatbase-widget-script");
      if (existing) existing.remove();
      const cfg = document.querySelector("script[data-chatbase-config]");
      if (cfg) cfg.remove();
    };
  }, []);

  return null;
}
