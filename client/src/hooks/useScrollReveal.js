//client/src/hooks/useScrollReveal.js
// client/src/hooks/useScrollReveal.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    // ✅ IMPORTANT FIX: force reveal if already visible on load
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight;

      if (isVisible) {
        el.classList.add("active");
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);
}
