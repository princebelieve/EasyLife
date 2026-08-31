//client/src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { getDistributorStore, getShippingDestinations, initializeCheckout, previewShipping } from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
const COUNTRY_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

export default function Checkout() {
  const { cart, subtotal, clearCart, removeFromCart } = useCart();
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingDestinations, setShippingDestinations] = useState(["NG"]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [distributor, setDistributor] = useState(null);

  const totalAmount = subtotal + shippingFee;
  function sendOrderSummaryToWhatsApp() {
    const items = cart.map((item) => `- ${item.quantity} x ${item.name} (${Number(item.price * item.quantity).toLocaleString()} NGN)`).join("\n");
    const delivery = form.deliveryMethod === "pickup" ? "Pickup (no shipping fee)" : `Delivery (${shippingFee.toLocaleString()} NGN)`;
    const message = `Hello Easy Life Wellness Hub, I would like help with this order:\n\n${items}\n\nSubtotal: ${subtotal.toLocaleString()} NGN\nCollection: ${delivery}\nTotal: ${totalAmount.toLocaleString()} NGN\n\nName: ${form.customerName || "Not entered"}\nPhone: ${form.phone || "Not entered"}`;
    window.open(`https://wa.me/2348089938820?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

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
    deliveryMethod: "delivery",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "country" && value !== "NG" ? { paymentMethod: "paystack" } : {}),
    }));

  }

  async function removeCheckoutItem(productId) {
    setCheckoutError("");
    await removeFromCart(productId);
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
    const code = sessionStorage.getItem("activeDistributorCode");
    if (!code) return;
    getDistributorStore(code).then((data) => setDistributor(data.distributor)).catch(() => { sessionStorage.removeItem("activeDistributorCode"); setDistributor(null); });
  }, []);

  useEffect(() => {
    async function loadShipping() {
      try {
        if (form.deliveryMethod === "pickup") {
          setShippingError("");
          setShippingFee(0);
          setShippingInfo({ serviceName: "Pickup", estimatedDays: "Ready after confirmation" });
          return;
        }
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
  }, [form.country, form.deliveryMethod, cart]);

  async function handleCheckout(e) {
    e.preventDefault();
    setCheckoutError("");
    setCheckoutLoading(true);

    try {
      const response = await initializeCheckout({
        ...form,
        distributorCode: sessionStorage.getItem("activeDistributorCode") || "",
      });

      if (["cash_on_delivery", "distributor_transfer"].includes(response.checkoutType)) {
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

              <fieldset className="payment-methods checkout-fulfilment-methods">
                <legend>How would you like to receive your order?</legend>
                <label className="payment-method-option"><input type="radio" name="deliveryMethod" value="delivery" checked={form.deliveryMethod === "delivery"} onChange={handleChange} /><span><strong>Delivery</strong><small>{distributor ? `${distributor.name} will arrange delivery.` : "Easy Life will arrange delivery."}</small></span></label>
                <label className="payment-method-option"><input type="radio" name="deliveryMethod" value="pickup" checked={form.deliveryMethod === "pickup"} onChange={handleChange} disabled={Boolean(distributor && !distributor.distributorPickupEnabled)} /><span><strong>Pick up — no shipping fee</strong><small>{distributor?.distributorPickupAddress || "Pick up from Easy Life Wellness Hub after confirmation."}</small></span></label>
              </fieldset>

              {form.deliveryMethod === "delivery" ? (
                <>
                  <input name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} required />
                  <select name="country" value={form.country} onChange={handleChange} required>
                    {shippingDestinations.map((country) => <option key={country} value={country}>{COUNTRY_NAMES.of(country) || country}</option>)}
                  </select>
                  <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                  <input name="state" placeholder="State / Region" value={form.state} onChange={handleChange} />
                </>
              ) : (
                <div className="checkout-pickup-note">
                  <strong>Pickup selected</strong>
                  <span>{distributor?.distributorPickupAddress || "Easy Life Wellness Hub will confirm the pickup location after your order is placed."}</span>
                </div>
              )}

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
                  <span><strong>Pay online securely</strong><small>Use card, bank transfer, or USSD through Paystack.</small></span>
                </label>
                {distributor && <label className="payment-method-option"><input type="radio" name="paymentMethod" value="distributor_transfer" checked={form.paymentMethod === "distributor_transfer"} onChange={handleChange} disabled={!distributor.distributorBankName || !distributor.distributorAccountNumber} /><span><strong>Transfer to {distributor.name}</strong><small>{distributor.distributorAccountName} · {distributor.distributorAccountNumber} · {distributor.distributorBankName}</small></span></label>}
                <label className="payment-method-option">
                  <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={form.paymentMethod === "cash_on_delivery"} onChange={handleChange} disabled={form.deliveryMethod === "delivery" && form.country !== "NG"} />
                  <span><strong>{form.deliveryMethod === "pickup" ? "Pay at pickup" : "Pay on delivery"}</strong><small>{form.deliveryMethod === "pickup" ? "Pay the total amount when you collect your order." : form.country === "NG" ? "Pay the total amount to the delivery agent when your order arrives." : "Available for deliveries within Nigeria only."}</small></span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="primary checkout-submit-button"
                disabled={checkoutLoading || Boolean(shippingError)}
              >
                {checkoutLoading
                  ? "Processing…"
                  : form.paymentMethod === "cash_on_delivery"
                    ? form.deliveryMethod === "pickup" ? "Place Order & Pay at Pickup" : "Place Order & Pay on Delivery"
                    : form.paymentMethod === "distributor_transfer"
                      ? "Place Transfer Order"
                      : "Continue to Secure Online Payment"}
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
                <div key={item.productId} className="checkout-summary-item">
                  <div>
                    <p>{item.name}</p>
                    <small>
                      {item.quantity} × ₦{Number(item.price).toLocaleString()}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="checkout-remove-item"
                    onClick={() => removeCheckoutItem(item.productId)}
                    aria-label={`Remove ${item.name} from checkout`}
                  >
                    Remove
                  </button>
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
                {form.deliveryMethod === "pickup" ? "Pickup selected — no shipping fee applies." : "Delivery selected — the delivery fee is included above."}
              </p>
              {distributor && (
                <div className="distributor-delivery-summary">
                  <strong>Fulfilled by {distributor.name}</strong>
                  <span>{form.deliveryMethod === "pickup" ? `Pickup location: ${distributor.distributorPickupAddress || "Address will be confirmed by the distributor."}` : "Delivery will be arranged by this distributor after your order is confirmed."}</span>
                </div>
              )}
              <button type="button" className="checkout-whatsapp-summary" onClick={sendOrderSummaryToWhatsApp}>
                Send order summary to Easy Life on WhatsApp
              </button>
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
