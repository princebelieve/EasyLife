import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function RelatedProductCarousel({ products = [] }) {
  const carouselProducts = products.slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => setActiveIndex(0), [carouselProducts.length]);

  useEffect(() => {
    if (carouselProducts.length < 2) return undefined;
    const delay = activeIndex === carouselProducts.length - 1 ? 30000 : 6500;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % carouselProducts.length),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, carouselProducts.length]);

  if (!carouselProducts.length) return null;
  const product = carouselProducts[activeIndex % carouselProducts.length];

  const showPrevious = (event) => {
    event.stopPropagation();
    setActiveIndex((index) => (index - 1 + carouselProducts.length) % carouselProducts.length);
  };
  const showNext = (event) => {
    event.stopPropagation();
    setActiveIndex((index) => (index + 1) % carouselProducts.length);
  };
  const openProduct = () => navigate(`/product/${product._id}`);

  return (
    <section className="collection-product-carousel" aria-label="Featured products">
      <article
        className="service-promo collection-product-promo"
        key={product._id}
        role="link"
        tabIndex={0}
        onClick={openProduct}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") openProduct();
        }}
        aria-label={`View ${product.name}`}
      >
        <img src={product.coverImage} alt="" aria-hidden="true" />
        <div className="service-promo-overlay" />
        <div className="service-promo-content">
          <span className="service-promo-kicker">FEATURED PRODUCT</span>
          {product.category && <span className="service-promo-label">{product.category}</span>}
          <h2>{product.name}</h2>
          <p>{product.shortDescription || "View product information, price, availability, and ordering options."}</p>
          <strong className="collection-product-promo-action">View Product <ArrowRight size={17} /></strong>
        </div>
        {carouselProducts.length > 1 && (
          <div className="service-promo-controls">
            <button type="button" onClick={showPrevious} aria-label="Previous product"><ArrowLeft size={17} /></button>
            <div className="service-promo-dots" aria-label="Choose product">
              {carouselProducts.map((item, index) => (
                <button key={item._id} type="button" className={index === activeIndex ? "active" : ""} onClick={(event) => { event.stopPropagation(); setActiveIndex(index); }} aria-label={`Show ${item.name}`} />
              ))}
            </div>
            <button type="button" onClick={showNext} aria-label="Next product"><ArrowRight size={17} /></button>
          </div>
        )}
      </article>
    </section>
  );
}
