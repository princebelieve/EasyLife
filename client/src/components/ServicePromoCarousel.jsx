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
    label: "EASY LIFE FAMILY",
    title: "Visit Easy Life Supermarket",
    text: "Shop everyday essentials for your home and family.",
    image: "/image-15.png",
    to: "https://supermarket.easylifewellnesshub.com",
    destination: "supermarket.easylifewellnesshub.com",
    action: "Visit supermarket",
  },
  {
    label: "EASY LIFE FAMILY",
    title: "Visit Easy Life Clinic",
    text: "Book eye-care appointments and get the support you need.",
    image: "/image-6.png",
    to: "https://clinic.easylifewellnesshub.com",
    destination: "clinic.easylifewellnesshub.com",
    action: "Visit clinic",
  },
];

export default function ServicePromoCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);
  const slides = [...promotions, promotions[0]];
  const activeIndex = activeSlide % promotions.length;

  useEffect(() => {
    promotions.forEach(({ image }) => {
      const preloadImage = new Image();
      preloadImage.src = image;
    });

    const timer = window.setInterval(() => {
      setActiveSlide((current) => current + 1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  function showPrevious() {
    if (activeSlide > 0) {
      setActiveSlide((current) => current - 1);
      return;
    }

    setTransitionsEnabled(false);
    setActiveSlide(promotions.length);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionsEnabled(true);
        setActiveSlide(promotions.length - 1);
      });
    });
  }

  function showNext() {
    setActiveSlide((current) => current + 1);
  }

  function handleTrackTransitionEnd() {
    if (activeSlide !== promotions.length) return;

    setTransitionsEnabled(false);
    setActiveSlide(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setTransitionsEnabled(true));
    });
  }

  return (
    <section className="service-promo-section reveal" aria-label="Easy Life services">
      <div className="container">
        <div className="service-promo-carousel">
          <div
            className="service-promo-track"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
              transition: transitionsEnabled ? "transform 0.55s ease" : "none",
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {slides.map((promotion, index) => (
              <article className="service-promo service-promo-slide" key={`${promotion.to}-${index}`}>
                <img src={promotion.image} alt="" aria-hidden="true" />
                <div className="service-promo-overlay" />
                <div className="service-promo-content">
                  <span className="service-promo-kicker">FEATURED ADVERT</span>
                  <span className="service-promo-label">{promotion.label}</span>
                  <h2>{promotion.title}</h2>
                  <p>{promotion.text}</p>
                  <strong className="service-promo-destination">{promotion.destination}</strong>
                  {promotion.to.startsWith("http") ? (
                    <a className="easy-btn easy-btn-primary breathing-button" href={promotion.to}>
                      {promotion.action} <ArrowRight size={17} />
                    </a>
                  ) : (
                    <Link className="easy-btn easy-btn-primary breathing-button" to={promotion.to}>
                      {promotion.action} <ArrowRight size={17} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="service-promo-controls">
            <button type="button" onClick={showPrevious} aria-label="Previous advert"><ArrowLeft size={17} /></button>
            <div className="service-promo-dots" aria-label="Choose advert">
              {promotions.map((promotion, index) => (
                <button key={promotion.to} type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Show ${promotion.title}`} />
              ))}
            </div>
            <button type="button" onClick={showNext} aria-label="Next advert"><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
