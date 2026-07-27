import { useEffect } from "react";

export default function ChatbaseWidget() {
  useEffect(() => {
    const chatbotId = import.meta.env.VITE_CHATBASE_CHATBOT_ID;

    if (!chatbotId) {
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

    return () => {
      const init = document.getElementById("chatbase-init-script");
      if (init) init.remove();

      const widget = document.getElementById(chatbotId);
      if (widget) widget.remove();
    };
  }, []);

  return null;
}
