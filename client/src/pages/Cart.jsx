//client/src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const shippingFee = subtotal > 0 ? 25000 : 0;

  const total = subtotal + shippingFee;

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>

            <Link to="/collection">
              <button className="primary">Browse Collections</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.productId}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-content">
                    <h3>{item.name}</h3>

                    <p>₦{Number(item.price).toLocaleString()}</p>

                    <div className="cart-actions">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn-danger"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p>
                Subtotal:
                <strong>₦{subtotal.toLocaleString()}</strong>
              </p>

              <p>
                Delivery:
                <strong>₦{shippingFee.toLocaleString()}</strong>
              </p>

              <h2>Total: ₦{total.toLocaleString()}</h2>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="primary"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed To Checkout
                </button>

                <button className="btn-danger" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
