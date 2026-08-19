//client/src/pages/Collection.jsx
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";

import useScrollReveal from "../hooks/useScrollReveal";

import { getProducts } from "../services/api";

export default function Collection() {
  useScrollReveal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <>
      <Navbar />

      <section className="shop-hero reveal">
        <div className="container shop-hero-grid">
          <div>
            <span className="eyebrow">NATUROPATHIC WELLNESS</span>
            <h1>Natural solutions for a healthier, longer, vibrant life.</h1>
            <p>Explore herbal products, supplements, wellness devices, and everyday care essentials from Easy Life Wellness Hub.</p>
          </div>
          <img src="/image-15.png" alt="Easy Life herbal products, wellness equipment, and natural care essentials" />
        </div>
      </section>

      <section className="section-alt reveal">
        <div className="container">
          <div className="reveal">
            <h1 className="title">Wellness Shop</h1>
            <p className="muted">
              Explore Easy Life wellness products for your everyday wellness journey.
            </p>
          </div>

          <div className="reveal">
            {loading ? (
              <div className="grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card skeleton-card">
                    <div className="skeleton-image" />

                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-price" />
                    <div className="skeleton-button" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
