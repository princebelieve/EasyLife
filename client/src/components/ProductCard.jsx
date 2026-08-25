import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const price = product.salePrice != null && Number(product.salePrice) < Number(product.price)
    ? product.salePrice
    : product.price;

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
      <h3>{product.name}</h3>
      {product.shortDescription && <p className="muted">{product.shortDescription}</p>}
      <p>₦{Number(price || 0).toLocaleString()}</p>
      {product.salePrice != null && Number(product.salePrice) < Number(product.price) && <small><s>₦{Number(product.price).toLocaleString()}</s></small>}
      <small>{Number(product.stock || 0) > 0 ? "In stock" : "Currently unavailable"}</small>
      <div className="card-actions">
        <button type="button" className="breathing-button" onClick={() => navigate(`/product/${product._id}`)}>View Product</button>
        <button className="wa breathing-button" onClick={() => window.open(`https://wa.me/2348089938820?text=Hello, I want to order ${product.name}`, "_blank")}>WhatsApp</button>
      </div>
    </div>
  );
}
