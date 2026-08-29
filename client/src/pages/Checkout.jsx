//client/src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { getShippingDestinations, initializeCheckout, previewShipping } from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
const COUNTRY_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingDestinations, setShippingDestinations] = useState(["NG"]);
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
    paymentMethod: "paystack",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "country" && value !== "NG" ? { paymentMethod: "paystack" } : {}),
    }));

  }

  useEffect(() => {
    getShippingDestinations()
      .then((destinations) => {
        setShippingDestinations(destinations);
        setForm((current) => destinations.includes(current.country) ? current : { ...current, country: destinations[0] || "NG" });
      })
      .catch(() => setShippingDestinations(["NG"]));
  }, []);

  useEffect(() => {
    async function loadShipping() {
      try {
        if (!form.country) {
          setShippingError("");
          setShippingFee(0);
          setShippingInfo(null);
          return;
        }

        const data = await previewShipping({
          country: form.country,
          items: cart,
        });

        setShippingError("");
        setShippingFee(Number(data.shippingFee || 0));
        setShippingInfo(data);
      } catch (err) {
        console.error(err);
        setShippingError(
          err.message || "Unable to verify delivery availability.",
        );
        setShippingFee(0);
        setShippingInfo(null);
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

      if (response.checkoutType === "cash_on_delivery") {
        await clearCart();
        window.location.href = response.confirmation_url;
        return;
      }

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
                {shippingDestinations.map((country) => <option key={country} value={country}>{COUNTRY_NAMES.of(country) || country}</option>)}
              </select>

              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />

              <input name="state" placeholder="State / Region" value={form.state} onChange={handleChange} />

              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={form.notes}
                onChange={handleChange}
              />

              <fieldset className="payment-methods">
                <legend>Choose a payment method</legend>
                <label className="payment-method-option">
                  <input type="radio" name="paymentMethod" value="paystack" checked={form.paymentMethod === "paystack"} onChange={handleChange} />
                  <span><strong>Pay online</strong><small>Card, bank transfer, or USSD through Paystack.</small></span>
                </label>
                <label className="payment-method-option">
                  <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={form.paymentMethod === "cash_on_delivery"} onChange={handleChange} disabled={form.country !== "NG"} />
                  <span><strong>Pay on delivery</strong><small>{form.country === "NG" ? "Pay the exact total to the delivery agent when your order arrives." : "Currently available for deliveries within Nigeria only."}</small></span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="primary"
                disabled={checkoutLoading || Boolean(shippingError)}
              >
                {checkoutLoading ? "Processing…" : form.paymentMethod === "cash_on_delivery" ? "Place Pay-on-Delivery Order" : "Continue To Payment"}
              </button>
              <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
                By placing your order, you accept our{" "}
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
                    href="https://wa.me/2348089938820"
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
                Delivery fee:
                <strong>₦{shippingFee.toLocaleString()}</strong>
              </p>

              <h2>Total to pay: ₦{totalAmount.toLocaleString()}</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                This amount becomes sales revenue only after payment is
                confirmed.
              </p>
              {shippingInfo?.serviceName && <p><span>Delivery method:</span><strong>{shippingInfo.serviceName}</strong></p>}
              {shippingInfo?.estimatedDays && <p><span>Estimated delivery:</span><strong>{shippingInfo.estimatedDays}</strong></p>}
              {shippingInfo?.dutiesAndTaxes && form.country !== "NG" && (
                <p className="muted">
                  {shippingInfo.dutiesAndTaxes === "included" ? "Duties and taxes are included." : "Import duties and taxes, if applicable, are paid by the customer."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
