//client/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createCheckoutSession } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

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

  async function buyNow() {
    try {
      const data = await createCheckoutSession(id);
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout session error:", err);

      if (err.message) {
        alert(err.message);
      } else {
        alert("Unable to start payment. Please try again.");
      }
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

          {product.gallery?.length > 0 && (
            <div className="gallery-strip">
              {product.gallery.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name}-${index}`}
                  className="gallery-thumb"
                  onClick={() => setLightboxImage(img)}
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
                      />
                    )}

                    <div className="piece-content">
                      <h3>{piece.name}</h3>

                      {piece.dimensions && <p>{piece.dimensions}</p>}

                      {piece.description && <span>{piece.description}</span>}

                      <strong>
                        £{Number(piece.price || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-content">
            <h1>{product.name}</h1>
            <h2>£{Number(product?.price || 0).toLocaleString()}</h2>

            <button className="primary" onClick={buyNow}>
              Buy Now
            </button>
          </div>
        </div>
        {lightboxImage && (
          <div className="lightbox" onClick={() => setLightboxImage(null)}>
            <img src={lightboxImage} alt="Preview" className="lightbox-image" />
          </div>
        )}
      </div>
    </>
  );
}
