//client/src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { initializeCheckout, previewShipping } from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
const SHIPPING_DESTINATIONS = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
];

export default function Checkout() {
  const { cart, subtotal } = useCart();
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingBaseFee, setShippingBaseFee] = useState(0);
  const [shippingCategoryFee, setShippingCategoryFee] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingError, setShippingError] = useState("");

  const totalAmount = subtotal + shippingFee;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "NG",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

  }

  useEffect(() => {
    async function loadShipping() {
      try {
        if (!form.country) {
          setShippingError("");
          setShippingFee(0);
          setShippingBaseFee(0);
          setShippingCategoryFee(0);
          return;
        }

        const data = await previewShipping({
          country: form.country,
          items: cart,
        });

        if (data.shippingAvailable === false) {
          setShippingError(
            data.message ||
              "Shipping is not available for the selected destination.",
          );
          setShippingFee(0);
          setShippingBaseFee(0);
          setShippingCategoryFee(0);
        } else {
          setShippingError("");
          setShippingFee(Number(data.shippingFee || 0));
          setShippingBaseFee(Number(data.baseFee || 0));
          setShippingCategoryFee(Number(data.categoryFee || 0));
        }
      } catch (err) {
        console.error(err);
        setShippingError(
          err.message || "Unable to verify delivery availability.",
        );
        setShippingFee(0);
        setShippingBaseFee(0);
        setShippingCategoryFee(0);
      }
    }

    loadShipping();
  }, [form.country, cart]);

  async function handleCheckout(e) {
    e.preventDefault();
    setCheckoutError("");
    setCheckoutLoading(true);

    try {
      const response = await initializeCheckout({
        ...form,
      });

      window.location.href = response.authorization_url;
    } catch (err) {
      console.error(err);

      setCheckoutError(err.message || "Unable to initialize checkout");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="checkout-layout">
            <form className="form" onSubmit={handleCheckout}>
              <input
                name="customerName"
                placeholder="Full Name"
                value={form.customerName}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                name="address"
                placeholder="Delivery Address"
                value={form.address}
                onChange={handleChange}
                required
              />

              <select name="country" value={form.country} onChange={handleChange} required>
                {SHIPPING_DESTINATIONS.map((destination) => <option key={destination.value} value={destination.value}>{destination.label}</option>)}
              </select>

              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />

              <input name="state" placeholder="State / Region" value={form.state} onChange={handleChange} />

              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={form.notes}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="primary"
                disabled={checkoutLoading || Boolean(shippingError)}
              >
                {checkoutLoading ? "Processing…" : "Continue To Payment"}
              </button>
              <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
                By clicking Continue To Payment, you accept our{" "}
                <a href="/refund-policy" style={{ color: "var(--gold)" }}>
                  Refund & Returns Policy
                </a>{" "}
                and{" "}
                <a href="/terms-conditions" style={{ color: "var(--gold)" }}>
                  Terms & Conditions
                </a>
                .
              </p>
              {shippingError && (
                <div className="error-message" style={{ marginTop: 12 }}>
                  <p>{shippingError}</p>
                  <a
                    href="https://wa.me/2348037757718"
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-button"
                    style={{ marginTop: 12, display: "inline-block" }}
                  >
                    Contact Support on WhatsApp
                  </a>
                </div>
              )}
              {checkoutError && (
                <p className="error-message" style={{ marginTop: 12 }}>
                  {checkoutError}
                </p>
              )}
            </form>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <p>{item.name}</p>

                  <small>
                    {item.quantity} × ₦{Number(item.price).toLocaleString()}
                  </small>
                </div>
              ))}

              <hr />

              <p>
                Subtotal:
                <strong>₦{subtotal.toLocaleString()}</strong>
              </p>

              <p>
                Shipping base fee:
                <strong>₦{shippingBaseFee.toLocaleString()}</strong>
              </p>

              <p>
                Shipping category fee:
                <strong>₦{shippingCategoryFee.toLocaleString()}</strong>
              </p>

              <p>
                Total shipping:
                <strong>₦{shippingFee.toLocaleString()}</strong>
              </p>

              <h2>Total to pay: ₦{totalAmount.toLocaleString()}</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                This amount becomes sales revenue only after payment is
                confirmed.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
