//client/src/pages/AdminOrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/api";
import { getToken } from "../utils/auth";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id, getToken()).then(setOrder);
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
      <div className="page">
        <h2>Order {order.orderNumber}</h2>

        <p>Customer: {order.customerName}</p>

        <p>Total: ₦{order.totalAmount}</p>

        <h3>Status Timeline</h3>

        {order.statusHistory?.map((s, i) => (
          <div key={i}>
            {s.status} — {new Date(s.date).toLocaleString()}
          </div>
        ))}
      </div>
    </>
  );
}
