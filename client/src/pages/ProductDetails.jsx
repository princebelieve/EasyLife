//client/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

import { getProductById } from "../services/api";

import { setMetaTags, setProductSchema, getShareUrl } from "../utils/metaTags";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);

        const data = await getProductById(id);

        setProduct(data);

        if (data) {
          const productUrl = `https://newbrend.vercel.app/product/${id}`;

          // Set meta tags for social sharing and SEO
          setMetaTags({
            title: `${data.name} | Newbrend Furniture`,
            description:
              data.description ||
              `Shop ${data.name} from Newbrend Furniture. Premium quality furniture and decorative accents.`,
            image: data.coverImage,
            url: productUrl,
            type: "product",
          });

          // Set JSON-LD schema for Google
          setProductSchema(data, productUrl);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const lightboxItems = [
    ...(product?.gallery || []).map((img, index) => ({
      image: img,
      title: product?.name || `Image ${index + 1}`,
      description: product?.description || "",
    })),

    ...(product?.pieces || []).map((piece) => ({
      image: piece.image,
      title: piece.name,
      description: piece.description || "",
    })),
  ].filter((item) => item.image);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="page">
          <div className="product-detail">
            <div className="skeleton-image" />

            <div className="product-detail-content">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-price" />
              <div className="skeleton-button" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="page">
          <h2>Product not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="product-detail">
          <img
            src={product.coverImage}
            alt={product.name}
            className="product-detail-image"
          />

          <div className="product-detail-content">
            <h1>{product.name}</h1>

            <h2>₦{Number(product?.price || 0).toLocaleString()}</h2>

            <button
              type="button"
              disabled={addLoading}
              onClick={async () => {
                setAddError("");
                setAddSuccess(false);
                setAddLoading(true);

                const result = await addToCart(product);

                setAddLoading(false);

                if (result.success) {
                  setAddSuccess(true);
                  setTimeout(() => setAddSuccess(false), 2000);
                } else {
                  setAddError(result.message || "Failed to add item to cart.");
                }
              }}
            >
              {addLoading
                ? "Adding..."
                : addSuccess
                  ? "Added ✔"
                  : "Add To Cart"}
            </button>

            <button
              type="button"
              className="primary"
              disabled={addLoading}
              onClick={async () => {
                setAddError("");
                setAddSuccess(false);
                setAddLoading(true);

                const result = await addToCart(product);

                setAddLoading(false);

                if (result.success) {
                  navigate("/checkout");
                } else {
                  setAddError(result.message || "Failed to add item to cart.");
                }
              }}
            >
              {addLoading ? "Adding..." : "Buy Now"}
            </button>

            {(addSuccess || addError) && (
              <div
                className={`inline-toast ${addSuccess ? "success" : "error"}`}
              >
                {addSuccess ? "Added to cart" : addError}
              </div>
            )}

            <div className="product-share-section">
              <p
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                Share:
              </p>
              <div
                className="share-buttons"
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <button
                  type="button"
                  className="share-btn share-facebook"
                  title="Share on Facebook"
                  onClick={() => {
                    const shareUrl = getShareUrl(product._id, product.name);
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                      "width=600,height=400",
                    );
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#1877f2",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Facebook
                </button>

                <button
                  type="button"
                  className="share-btn share-twitter"
                  title="Share on Twitter"
                  onClick={() => {
                    const shareUrl = getShareUrl(product._id, product.name);
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out ${encodeURIComponent(product.name)} from Newbrend Furniture`,
                      "_blank",
                      "width=600,height=400",
                    );
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#1da1f2",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Twitter
                </button>

                <button
                  type="button"
                  className="share-btn share-whatsapp"
                  title="Share on WhatsApp"
                  onClick={() => {
                    const shareUrl = getShareUrl(product._id, product.name);
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.name} - ${shareUrl}`)}`,
                      "_blank",
                    );
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#25d366",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  WhatsApp
                </button>

                <button
                  type="button"
                  className="share-btn share-copy"
                  title="Copy link"
                  onClick={() => {
                    const shareUrl = getShareUrl(product._id, product.name);
                    navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
                    color: "#333",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {product.gallery?.length > 0 && (
          <div className="gallery-strip">
            {product.gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className="gallery-thumb"
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        )}

        {product.pieces?.length > 0 && (
          <div className="pieces-section">
            <h2>Included Pieces</h2>

            <div className="pieces-grid">
              {product.pieces.map((piece, index) => (
                <div key={index} className="piece-display-card">
                  {piece.image && (
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="piece-image"
                      onClick={() =>
                        setLightboxIndex((product.gallery?.length || 0) + index)
                      }
                    />
                  )}

                  <div className="piece-content">
                    <h3>{piece.name}</h3>

                    {piece.dimensions && <p>{piece.dimensions}</p>}

                    {piece.description && <span>{piece.description}</span>}

                    <strong>
                      ₦{Number(piece.price || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lightboxIndex !== null && (
          <div className="lightbox">
            <button
              className="lightbox-close"
              onClick={() => setLightboxIndex(null)}
            >
              ✕
            </button>

            {lightboxIndex > 0 && (
              <button
                className="lightbox-arrow left"
                onClick={() => setLightboxIndex((prev) => prev - 1)}
              >
                ‹
              </button>
            )}

            {lightboxIndex < lightboxItems.length - 1 && (
              <button
                className="lightbox-arrow right"
                onClick={() => setLightboxIndex((prev) => prev + 1)}
              >
                ›
              </button>
            )}

            <div
              className="lightbox-slider"
              style={{
                transform: `translateX(-${lightboxIndex * 100}%)`,
              }}
            >
              {lightboxItems.map((item, index) => (
                <div className="lightbox-slide" key={index}>
                  <img src={item.image} alt={item.title} />

                  <div className="lightbox-overlay">
                    <h3>{item.title}</h3>

                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
