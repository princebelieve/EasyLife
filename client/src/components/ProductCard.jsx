//client/src/components/ProductCard.jsx
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card hover-lift">
      <img src={product.image} alt={product.name} />

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
