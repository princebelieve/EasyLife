//client/src/components/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const heroImages = ["/hero1.jpeg", "/hero2.jpeg", "/hero3.jpeg", "/hero4.jpeg"];

export default function Hero() {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.55) 30%,
            rgba(0,0,0,0.35) 50%,
            rgba(0,0,0,0.18) 75%
          ),
          url(${heroImages[currentImage]})
        `,
      }}
    >
      <div className="hero-content">
        <h1>Design Your Perfect Home.</h1>

        <p>
          High-end furniture, custom interiors, and luxury living spaces for
          every room.
        </p>

        <div>
          <button className="primary" onClick={() => navigate("/collection")}>
            Show Room
          </button>

          <button
            className="secondary"
            onClick={() => window.open("https://wa.me/2348037757718", "_blank")}
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
