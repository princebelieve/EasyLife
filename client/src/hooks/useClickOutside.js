//client/src/hooks/useClickOutside.js
import { useEffect } from "react";

export default function useClickOutside(refs, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function listener(event) {
      const refArray = Array.isArray(refs) ? refs : [refs];

      const clickedInside = refArray.some((ref) => {
        return ref?.current?.contains(event.target);
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
