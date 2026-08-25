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
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = !query
      ? products
      : products.filter((product) =>
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

    return [...matches].sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-low":
          return Number(a.salePrice ?? a.price ?? 0) - Number(b.salePrice ?? b.price ?? 0);
        case "price-high":
          return Number(b.salePrice ?? b.price ?? 0) - Number(a.salePrice ?? a.price ?? 0);
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [products, searchQuery, sortOrder]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!Array.isArray(data)) {
          throw new Error("The product service returned an unexpected response.");
        }

        setProducts(data.filter((product) => product && typeof product === "object"));
      } catch (error) {
        console.error("Unable to load products", error);
        setProducts([]);
        setLoadError(
          `We could not load the wellness shop right now${error?.message ? `: ${error.message}` : ". Please refresh the page in a moment."}`,
        );
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
            <p className="collection-shop-instruction">Search for a product or choose one below. Click the View Product button for more details.</p>

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

            <div className="product-sort">
              <label htmlFor="product-sort">Arrange products</label>
              <select
                id="product-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>

            {!loading && !loadError && <RelatedProductCarousel products={products} />}
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
            ) : loadError ? (
              <div className="product-load-error" role="alert">
                <p>{loadError}</p>
                <button type="button" onClick={() => window.location.reload()}>
                  Try again
                </button>
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
