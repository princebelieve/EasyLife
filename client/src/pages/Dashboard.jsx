//client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getMyOrders } from "../services/api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        const data = await getMyOrders(token);

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
