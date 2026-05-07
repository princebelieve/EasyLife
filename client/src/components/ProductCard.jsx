//client/src/components/ProductCard.jsx
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card hover-lift">
      <div
        className="card-image-wrap"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />

        <div className="card-image-overlay" />
      </div>

      <h3>{product.name}</h3>
      <p>£{product.price.toLocaleString()}</p>

      <button onClick={() => navigate(`/product/${product._id}`)}>
        View Product
      </button>

      <button
        className="wa"
        onClick={() =>
          window.open(
            `https://wa.me/2348037757718?text=Hello, I want to order ${product.name}`,
            "_blank",
          )
        }
      >
        WhatsApp
      </button>
    </div>
  );
}
