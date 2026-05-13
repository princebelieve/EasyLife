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

      <section className="section-alt reveal">
        <div className="container">
          <div className="reveal">
            <h1 className="title">All Products</h1>
            <p className="muted">
              Explore luxury furniture, decorative accents, and custom interior
              pieces.
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
