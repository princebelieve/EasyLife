import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const promotions = [
  {
    label: "EASY LIFE WELLNESS HUB",
    title: "Natural health for a vibrant life.",
    text: "Explore wellness products, education, and practical support.",
    image: "/image-13.png",
    to: "/collection",
    destination: "easylifewellnesshub.com/collection",
    action: "Shop wellness products",
  },
  {
    label: "EASYLIFE SUPERMARKET",
    title: "Everyday essentials for your home and family.",
    text: "Ask about convenient products and services from the Easy Life family.",
    image: "/image-15.png",
    to: "https://supermarket.easylifewellnesshub.com",
    destination: "supermarket.easylifewellnesshub.com",
    action: "Learn more",
  },
  {
    label: "EASY LIFE EYE CLINIC",
    title: "Clearer vision. Better everyday living.",
    text: "Contact us to ask about eye-care appointments and support.",
    image: "/image-6.png",
    to: "https://clinic.easylifewellnesshub.com",
    destination: "clinic.easylifewellnesshub.com",
    action: "Make an enquiry",
  },
];

export default function ServicePromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePromotion = promotions[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % promotions.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + promotions.length) % promotions.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % promotions.length);
  }

  return (
    <section className="service-promo-section reveal" aria-label="Easy Life services">
      <div className="container">
        <div className="service-promo" key={activePromotion.label}>
          <img src={activePromotion.image} alt="" aria-hidden="true" />
          <div className="service-promo-overlay" />
          <div className="service-promo-content">
            <span className="service-promo-kicker">FEATURED ADVERT</span>
            <span className="service-promo-label">{activePromotion.label}</span>
            <h2>{activePromotion.title}</h2>
            <p>{activePromotion.text}</p>
            <strong className="service-promo-destination">{activePromotion.destination}</strong>
            {activePromotion.to.startsWith("http") ? (
              <a className="easy-btn easy-btn-primary breathing-button" href={activePromotion.to}>
                {activePromotion.action} <ArrowRight size={17} />
              </a>
            ) : (
              <Link className="easy-btn easy-btn-primary breathing-button" to={activePromotion.to}>
                {activePromotion.action} <ArrowRight size={17} />
              </Link>
            )}
          </div>
          <div className="service-promo-controls">
            <button type="button" onClick={showPrevious} aria-label="Previous advert"><ArrowLeft size={17} /></button>
            <div className="service-promo-dots" aria-label="Choose advert">
              {promotions.map((promotion, index) => (
                <button key={promotion.label} type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${promotion.label}`} />
              ))}
            </div>
            <button type="button" onClick={showNext} aria-label="Next advert"><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
