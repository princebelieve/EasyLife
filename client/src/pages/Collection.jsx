//client/src/pages/Collection.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import useScrollReveal from "../hooks/useScrollReveal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Collection() {
  useScrollReveal();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      <Navbar />

      <section className="section-alt reveal">
        <div className="container">
          <div className="reveal">
            <h1 className="title">All Products</h1>
            <p className="muted">
              Explore luxury furniture, decorative accents, and custom interior pieces.
            </p>
          </div>

          <div className="reveal">
            <ProductGrid products={products} />
          </div>
        </div>
      </section>
    </>
  );
}
