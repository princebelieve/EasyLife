//client/src/pages/Collection.jsx
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import RelatedProductCarousel from "../components/RelatedProductCarousel";

import useScrollReveal from "../hooks/useScrollReveal";

import { getProducts } from "../services/api";

export default function Collection() {
  useScrollReveal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.shortDescription,
        product.fullDescription,
        product.category,
        product.brand,
        product.sku,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, searchQuery]);

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

            <div className="product-search" role="search">
              <label htmlFor="product-search">Search products</label>
              <input
                id="product-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by product, category, brand, or code"
                autoComplete="off"
              />
            </div>

            {!loading && <RelatedProductCarousel products={products} />}
            <p className="collection-details-hint">Click the View Product button for more details.</p>
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
              filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <p className="product-search-empty">
                  No products match “{searchQuery.trim()}”. Try another name, category, or brand.
                </p>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
