import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const isOnSale = product.salePrice != null && Number(product.salePrice) < Number(product.price);
  const price = isOnSale ? product.salePrice : product.price;
  const inStock = Number(product.stock || 0) > 0;

  useEffect(() => setImageFailed(false), [product.coverImage]);

  return (
    <div className="card hover-lift">
      <div className="card-image-wrap" onClick={() => navigate(`/product/${product._id}`)}>
        {product.coverImage && !imageFailed ? (
          <img
            src={product.coverImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => {
              console.warn("Product image could not be loaded", {
                productId: product._id,
                name: product.name,
                imageUrl: product.coverImage,
              });
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="card-image-fallback" role="img" aria-label={`${product.name} image unavailable`}>
            Image unavailable
          </div>
        )}
        <div className="card-image-overlay" />
      </div>

      <div className="card-body">
        <h3>{product.name}</h3>

        {product.shortDescription && (
          <div className="card-description-block">
            <p
              className="muted card-short-description card-clickable-description"
              onClick={() => navigate(`/product/${product._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/product/${product._id}`);
                }
              }}
              aria-label={`Open product details for ${product.name}`}
            >
              {product.shortDescription}
            </p>
          </div>
        )}

        <div className="card-price-block">
          <div className="card-price-row">
            <span className="card-price-label">Price</span>
            <span className="card-price">₦{Number(price || 0).toLocaleString()}</span>
          </div>

          {isOnSale && <small className="card-original-price">Was ₦{Number(product.price).toLocaleString()}</small>}

          <div className={`card-stock ${inStock ? "in-stock" : "out-of-stock"}`}>
            {inStock ? "In stock" : "Currently unavailable"}
          </div>
        </div>

        <div className="card-actions">
          <button type="button" className="breathing-button" onClick={() => navigate(`/product/${product._id}`)}>View Product</button>
          <button className="wa breathing-button" onClick={() => window.open(`https://wa.me/2348089938820?text=Hello, I want to order ${product.name}`, "_blank")}>WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
