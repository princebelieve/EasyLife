//client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

import useScrollReveal from "../hooks/useScrollReveal";

import { getProducts } from "../services/api";

const STORAGE_KEY = "newbrend-home-media";
const fallbackMedia = [
  {
    id: "fallback-1",
    type: "image",
    title: "Luxury Interiors",
    caption: "Elegant rooms shaped with premium finishes and timeless design.",
    src: "/hero1.jpeg",
  },
  {
    id: "fallback-2",
    type: "image",
    title: "Modern Comfort",
    caption: "Relaxed, refined pieces that bring warmth and detail to any space.",
    src: "/hero2.jpeg",
  },
  {
    id: "fallback-3",
    type: "image",
    title: "Crafted Living",
    caption: "Thoughtful collections designed for everyday luxury and comfort.",
    src: "/hero3.jpeg",
  },
];

export default function Home() {
  useScrollReveal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState(fallbackMedia);

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

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMediaItems(parsed);
        }
      }
    } catch {
      setMediaItems(fallbackMedia);
    }
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

      {/* MEDIA SHOWCASE */}
      <section className="section-alt reveal">
        <div className="container">
          <div className="home-media-header">
            <div>
              <h2 className="title">Inspiration Gallery</h2>
              <p className="muted">
                Discover beautifully styled interiors, premium finishes, and timeless furniture for every space.
              </p>
            </div>
            <Link className="primary home-media-cta" to="/collection">
              Explore Collection
            </Link>
          </div>

          <div className="home-media-grid">
            {mediaItems.map((item) => (
              <div key={item.id} className="home-media-card hover-lift">
                {item.type === "video" ? (
                  <video src={item.src} controls playsInline muted loop />
                ) : (
                  <img src={item.src} alt={item.title} />
                )}

                <div className="home-media-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.caption}</p>
                  <Link className="secondary home-media-button" to="/collection">
                    Shop Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="section reveal">
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
