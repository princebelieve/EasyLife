//client/src/hooks/useClickOutside.js
import { useEffect } from "react";

export default function useClickOutside(refs, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function listener(event) {
      const refArray = Array.isArray(refs) ? refs : [refs];

      const clickedInside = refArray.some((ref) => {
        if (!ref) return false;

        // Support both ref objects ({ current }) and direct DOM nodes
        const node = ref.current !== undefined ? ref.current : ref;

        if (!node) return false;

        // Ensure contains is a function before calling
        if (typeof node.contains === "function") {
          return node.contains(event.target);
        }

        return false;
      });

      if (clickedInside) return;

      handler(event);
    }

    document.addEventListener("click", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler, enabled]);
}
