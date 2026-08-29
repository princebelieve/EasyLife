//client/src/pages/Success.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderToken = searchParams.get("order_token");
  const isPaid = Boolean(order?.paymentStatus === "paid");
  const isCashOnDelivery = order?.paymentMethod === "cash_on_delivery";
  const isError = Boolean(error || !order);
  const pageTitle = isError
    ? "⚠️ Verification Pending"
    : isCashOnDelivery
    ? "Order received — pay on delivery"
    : isPaid
    ? "✅ Payment Received!"
    : "⏳ Payment Processing...";
  const pageMessage = isError
    ? error ||
      "We're processing your payment. Order details will appear here shortly."
    : isCashOnDelivery
    ? "We will confirm your order before dispatch. Please pay the delivery agent when it arrives."
    : isPaid
    ? "Your order has been confirmed and is being prepared."
    : "We're processing your payment. Check back soon for updates.";

  useEffect(() => {
    if (!orderToken) {
      setError("This order confirmation link is missing or invalid. Please view the order in your dashboard.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/orders/confirmation/${orderToken}`);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderToken]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          className="page"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <p>Loading order details...</p>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div
          className="page"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div className="cart-summary">
            <h1 style={{ fontSize: "2.5em", margin: "0 0 10px 0" }}>
              {pageTitle}
            </h1>
            <p style={{ marginTop: 14, color: "#666" }}>
              {pageMessage}
            </p>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.9em",
                color: "#999",
              }}
            >
              Order confirmations are available once only. Please use your dashboard to view your order.
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
              <button
                className="primary"
                onClick={() => navigate("/dashboard")}
              >
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

  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* Success Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <h1 style={{ fontSize: "2.5em", margin: "0 0 10px 0" }}>
            {pageTitle}
          </h1>
          <p
            style={{
              fontSize: "1.1em",
              color: "#666",
              margin: "10px 0",
            }}
          >
            {pageMessage}
          </p>
        </div>

        {/* Order Confirmation Card */}
        <div className="cart-summary">
          {/* Order Number & Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 15,
              borderBottom: "1px solid #eee",
              marginBottom: 20,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.9em", color: "#999" }}>
                Order Number
              </p>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: "1.3em",
                  fontWeight: "bold",
                }}
              >
                {order.orderNumber}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: "0.85em",
                  fontWeight: "bold",
                  backgroundColor: isPaid ? "#d4edda" : "#fff3cd",
                  color: isPaid ? "#155724" : "#856404",
                }}
              >
                {isPaid ? "PAID" : isCashOnDelivery ? "PAY ON DELIVERY" : "PENDING"}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1em" }}>
              Order Items
            </h3>
            {order.items && order.items.length > 0 ? (
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "500",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          margin: "3px 0 0 0",
                          fontSize: "0.9em",
                          color: "#999",
                        }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "500",
                        minWidth: 80,
                        textAlign: "right",
                      }}
                    >
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999", margin: 0 }}>No items in order</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div
            style={{
              padding: "15px 0",
              borderTop: "1px solid #eee",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666" }}>Subtotal</span>
              <span>₦{order.subtotal?.toLocaleString() || 0}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666" }}>Shipping Fee</span>
              <span>₦{order.shippingFee?.toLocaleString() || 0}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "2px solid #eee",
                fontSize: "1.2em",
                fontWeight: "bold",
              }}
            >
              <span>Total Amount</span>
              <span>₦{order.totalAmount?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Delivery Information */}
          {(order.deliveryEstimate || order.estimatedDeliveryDate || order.shippingService) && (
            <div
              style={{
                padding: "15px",
                backgroundColor: "#f9f9f9",
                borderRadius: 6,
                marginBottom: 20,
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95em" }}>
                📦 Delivery Information
              </h4>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Destination:</strong> {order.city}, {order.state}
                </p>
                {order.deliveryEstimate && <p style={{ margin: "5px 0" }}><strong>Delivery estimate:</strong> {order.deliveryEstimate}</p>}
                {order.estimatedDeliveryDate && <p style={{ margin: "5px 0" }}><strong>Estimated arrival:</strong> {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>}
                {order.shippingService && <p style={{ margin: "5px 0" }}><strong>Delivery method:</strong> {order.shippingService}</p>}
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#fafafa",
              borderRadius: 6,
              marginBottom: 20,
              fontSize: "0.9em",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>📍 Delivery Address</h4>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>{order.customerName}</strong>
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#666" }}>
              {order.address}
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#666" }}>
              {order.city}, {order.state}
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#666" }}>
              Phone: {order.phone}
            </p>
          </div>

          {/* Payment Reference */}
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
              marginBottom: 20,
              fontSize: "0.85em",
              color: "#999",
            }}
          >
            <p style={{ margin: 0 }}>
              Payment Reference: <code>{order.paymentReference}</code>
            </p>
          </div>

          {/* Action Buttons */}
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
