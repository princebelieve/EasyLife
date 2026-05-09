//client/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { initializePayment } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.message === "Product not found") {
          setProduct(null);
          return;
        }
        setProduct(data);
      });
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

  async function buyNow() {
    try {
      const customerName = prompt("Enter your full name");

      if (!customerName) return;

      const email = prompt("Enter your email");

      if (!email) return;

      const phone = prompt("Enter your phone number");

      if (!phone) return;

      const data = await initializePayment({
        productId: id,
        customerName,
        email,
        phone,
      });

      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);

      alert("Unable to initialize payment");
    }
  }

  if (!product) {
    return (
      <div className="page">
        <Navbar />
        <h2>Product not found</h2>
      </div>
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

            <button className="primary" onClick={buyNow}>
              Buy Now
            </button>
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
