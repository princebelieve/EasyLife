//client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/users/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>My Orders</h1>

        {orders.map((order) => (
          <div key={order._id} className="cart-summary">
            <h3>₦{Number(order.totalAmount || 0).toLocaleString()}</h3>

            <p>
              Payment:
              {order.paymentStatus}
            </p>

            <p>
              Delivery:
              {order.deliveryStatus}
            </p>

            {order.items?.map((item) => (
              <div key={item.productId}>
                <small>
                  {item.quantity} × {item.name}
                </small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
