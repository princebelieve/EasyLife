//client/src/pages/Success.jsx
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Success() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        className="page"
        style={{
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div className="cart-summary">
          <h1>Payment Successful 🎉</h1>

          <p style={{ marginTop: 14 }}>
            Your payment has been received successfully.
          </p>

          <p className="muted" style={{ marginTop: 10 }}>
            Your order is now being processed.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 30,
            }}
          >
            <button className="primary" onClick={() => navigate("/dashboard")}>
              View My Orders
            </button>

            <Link to="/collection">
              <button>Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
