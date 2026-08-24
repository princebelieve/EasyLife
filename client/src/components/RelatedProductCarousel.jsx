import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RelatedProductCarousel({ products = [] }) {
  const carouselProducts = products.slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setActiveIndex(0);
    setVisible(true);
  }, [carouselProducts.length]);

  useEffect(() => {
    if (carouselProducts.length < 2) return undefined;

    const isLastProduct = activeIndex === carouselProducts.length - 1;
    const displayTime = isLastProduct ? 30000 : 6500;
    const fadeOutTimer = window.setTimeout(() => setVisible(false), displayTime - 900);
    const nextProductTimer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % carouselProducts.length);
      setVisible(true);
    }, displayTime);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(nextProductTimer);
    };
  }, [activeIndex, carouselProducts.length]);

  if (!carouselProducts.length) return null;
  const product = carouselProducts[activeIndex % carouselProducts.length];

  return (
    <section className="collection-product-carousel" aria-label="Discover more products">
      <div className="collection-product-carousel-heading">
        <div><span>DISCOVER MORE</span><h2>Explore wellness products</h2></div>
        <p>Swipe through and tap a product to view its full information.</p>
      </div>
      <div className={`collection-product-carousel-track ${visible ? "is-visible" : ""}`}>
        <Link className="collection-product-carousel-card" to={`/product/${product._id}`}>
          <img src={product.coverImage} alt={product.name} loading="lazy" />
          <div>
            {product.category && <span>{product.category}</span>}
            <h3>{product.name}</h3>
            <p>{product.shortDescription || "View product information, price, availability, and ordering options."}</p>
            <strong>View product <ArrowRight size={15} /></strong>
          </div>
        </Link>
      </div>
    </section>
  );
}
