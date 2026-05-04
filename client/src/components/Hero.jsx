//client/src/components/Hero.jsx
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div>
        <h1>Design Your Perfect Home.</h1>

        <p>
          High-end furniture, custom interiors, and luxury living spaces for every room.
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
