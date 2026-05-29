//client/src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { initializeCheckout, previewShipping } from "../services/api";
import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, subtotal } = useCart();
  const [shippingFee, setShippingFee] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    async function loadShipping() {
      try {
        if (!form.state || !form.city) {
          setShippingFee(0);
          return;
        }

        const data = await previewShipping({
          city: form.city,
          state: form.state,
          items: cart,
        });

        setShippingFee(Number(data.shippingFee || 0));
      } catch (err) {
        console.error(err);
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

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
              />

              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                required
              />

              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={form.notes}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="primary"
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing…" : "Continue To Payment"}
              </button>
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
                Delivery:
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
