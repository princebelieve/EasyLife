//client/src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { initializeCheckout, previewShipping } from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import ngGeo from "../config/ng-geo.json";

// Generate state options from ng-geo.json, with values in lowercase for database matching
const NIGERIAN_STATES = Object.keys(ngGeo).map((stateName) => ({
  value: stateName.toLowerCase(),
  label:
    stateName === "FCT" ? "Federal Capital Territory" : `${stateName} State`,
}));

export default function Checkout() {
  const { cart, subtotal } = useCart();
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingBaseFee, setShippingBaseFee] = useState(0);
  const [shippingCategoryFee, setShippingCategoryFee] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  const totalAmount = subtotal + shippingFee;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Update available cities when state changes
    if (name === "state") {
      const stateKey = Object.keys(ngGeo).find(
        (key) => key.toLowerCase() === value.toLowerCase(),
      );
      const cities = stateKey ? ngGeo[stateKey] : [];
      setAvailableCities(cities);
      setForm((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }

  useEffect(() => {
    async function loadShipping() {
      try {
        if (!form.state || !form.city) {
          setShippingError("");
          setShippingFee(0);
          setShippingBaseFee(0);
          setShippingCategoryFee(0);
          return;
        }

        const data = await previewShipping({
          city: form.city,
          state: form.state,
          items: cart,
        });

        if (data.shippingAvailable === false) {
          setShippingError(
            data.message ||
              "The selected city is not available. Please contact support.",
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
  }, [form.city, form.state, cart]);

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

              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                disabled={!form.state}
              >
                <option value="">
                  {form.state ? "Select a City/LGA" : "Select a State first"}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              >
                <option value="">Select a State</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>

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

              <h2>Total: ₦{totalAmount.toLocaleString()}</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
