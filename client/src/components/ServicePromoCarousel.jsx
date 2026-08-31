import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const promotions = [
  { label: "EASY LIFE WELLNESS HUB", title: "Natural health for a vibrant life.", text: "Explore wellness products, education, and practical support.", image: "/wellness.jpeg", to: "/collection", destination: "easylifewellnesshub.com/collection", action: "Shop wellness products" },
  { label: "EASY LIFE FAMILY", title: "Visit Easy Life Supermarket", text: "Shop everyday essentials for your home and family.", image: "/supermarket.jpeg", to: "https://supermarket.easylifewellnesshub.com", destination: "supermarket.easylifewellnesshub.com", action: "Visit supermarket" },
  { label: "EASY LIFE FAMILY", title: "Visit Easy Life Clinic", text: "Book eye-care appointments and get the support you need.", image: "/ceo.png", imageClass: "service-promo-image-ceo", to: "https://clinic.easylifewellnesshub.com", destination: "clinic.easylifewellnesshub.com", action: "Visit clinic" },
];

export default function ServicePromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const promotion = promotions[activeIndex];
  useEffect(() => {
    promotions.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % promotions.length), 5500);
    return () => window.clearInterval(timer);
  }, []);
  const previous = () => setActiveIndex((index) => (index - 1 + promotions.length) % promotions.length);
  const next = () => setActiveIndex((index) => (index + 1) % promotions.length);
  const action = promotion.to.startsWith("http") ? <a className="easy-btn easy-btn-primary breathing-button" href={promotion.to}>{promotion.action} <ArrowRight size={17} /></a> : <Link className="easy-btn easy-btn-primary breathing-button" to={promotion.to}>{promotion.action} <ArrowRight size={17} /></Link>;
  return <section className="service-promo-section reveal" aria-label="Easy Life services"><div className="container"><div className="service-promo-carousel"><article className="service-promo service-promo-slide" key={promotion.to}><img className={promotion.imageClass} src={promotion.image} alt="" aria-hidden="true" /><div className="service-promo-overlay" /><div className="service-promo-content"><span className="service-promo-kicker">FEATURED ADVERT</span><span className="service-promo-label">{promotion.label}</span><h2>{promotion.title}</h2><p>{promotion.text}</p><strong className="service-promo-destination">{promotion.destination}</strong>{action}</div><div className="service-promo-controls"><button type="button" onClick={previous} aria-label="Previous advert"><ArrowLeft size={17} /></button><div className="service-promo-dots" aria-label="Choose advert">{promotions.map((item, index) => <button key={item.to} type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${item.title}`} />)}</div><button type="button" onClick={next} aria-label="Next advert"><ArrowRight size={17} /></button></div></article></div></div></section>;
}
