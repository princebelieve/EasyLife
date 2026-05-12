//client/src/pages/Checkout.jsx
import { useState } from "react";
import { initializeCheckout } from "../services/api";
import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, subtotal } = useCart();

  const shippingFee = subtotal > 0 ? 25000 : 0;

  const total = subtotal + shippingFee;

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

  async function handleCheckout(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await initializeCheckout(
        {
          ...form,
        },
        token,
      );

      window.location.href = response.authorization_url;
    } catch (err) {
      console.error(err);

      alert(err.message || "Unable to initialize checkout");
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

              <button type="submit" className="primary">
                Continue To Payment
              </button>
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

              <h2>Total: ₦{total.toLocaleString()}</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
