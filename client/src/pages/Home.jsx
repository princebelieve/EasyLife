//client/src/pages/Home.jsx
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

import useScrollReveal from "../hooks/useScrollReveal";

import { getProducts } from "../services/api";

export default function Home() {
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

      {/* HERO */}
      <section className="hero-section reveal">
        <Hero />
      </section>

      {/* DUAL AUDIENCE SECTION */}
      <section className="section reveal">
        <div className="container dual-grid">
          <div className="dual-card hover-lift">
            <span className="dual-label">READY TO SHIP</span>
            <h2>Premium Furniture Collection</h2>
            <p>
              Discover curated sofas, tables, chairs and decor designed for
              elegant living.
            </p>
          </div>

          <div className="dual-card hover-lift">
            <span className="dual-label">BESPOKE DESIGN</span>
            <h2>Custom Interiors For Your Space</h2>
            <p>
              Every piece is built to suit your room, materials and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="section-alt reveal">
        <div className="container">
          <h2 className="title">Featured Collection</h2>
          <p className="muted">
            Luxury furniture and interior pieces for every room
          </p>

          {loading ? (
            <div className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
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
      </section>

      {/* SERVICES */}
      <section className="section reveal">
        <div className="container">
          <h2 className="title">Our Services</h2>

          <div className="service-grid">
            <div className="service-card hover-lift">
              <h3>Luxury Furniture</h3>
              <p>
                Hand-finished sofas, tables, cabinets and upholstered accents.
              </p>
            </div>

            <div className="service-card hover-lift">
              <h3>Custom Design</h3>
              <p>
                We bring your interior ideas into reality from concept to
                delivery.
              </p>
            </div>

            <div className="service-card hover-lift">
              <h3>Fast Delivery</h3>
              <p>
                Km 15, Agbor-Eku Road, Abraka, Delta State, Nigeria. We deliver
                nationwide across Nigeria within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner reveal">
        <div className="container">
          <h2>Ready to Refresh Your Interior?</h2>
          <p>Shop furniture or request a custom design consultation today.</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
