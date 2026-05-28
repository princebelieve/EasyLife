//client/src/pages/AdminOrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatusApi } from "../services/api";
import { getToken } from "../utils/auth";
import { formatDate } from "../utils/formatDate";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id, getToken()).then(setOrder);
  }, [id]);

  async function updateStatus(orderId, status) {
    try {
      const updated = await updateOrderStatusApi(orderId, status, getToken());

      setOrder(updated);
    } catch (err) {
      console.error(err);
    }
  }

  if (!order) return <p>Loading...</p>;

  return (
    <div className="page order-detail-grid">
      <div className="order-main">
        <h2>Order {order.orderNumber}</h2>

        <div className="order-card">
          <h3>Customer Info</h3>
          <p>{order.customerName}</p>
        </div>

        <div className="order-card">
          <h3>Items</h3>
          {order.items.map((item) => (
            <div key={item.productId} className="order-item">
              {item.quantity} × {item.name}
            </div>
          ))}
        </div>

        <div className="order-card">
          <h3>Status Timeline</h3>
          {order.statusHistory?.map((s, i) => (
            <div key={i}>
              {s.status} — {formatDate(s.date)}
            </div>
          ))}
        </div>
      </div>

      <div className="order-side">
        <div className="order-card">
          <h3>Summary</h3>
          <p>Total: ₦{order.totalAmount}</p>
          <p>Placed: {formatDate(order.createdAt)}</p>
          {order.paidAt && <p>Paid: {formatDate(order.paidAt)}</p>}
          {order.estimatedDeliveryDate && (
            <p>ETA: {formatDate(order.estimatedDeliveryDate)}</p>
          )}
          {order.deliveredAt && (
            <p>Delivered: {formatDate(order.deliveredAt)}</p>
          )}
          {order.cancelledAt && (
            <p>Cancelled: {formatDate(order.cancelledAt)}</p>
          )}
        </div>

        <div className="order-card">
          <h3>Update Status</h3>

          <select
            value={order.deliveryStatus}
            onChange={(e) => updateStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
}
