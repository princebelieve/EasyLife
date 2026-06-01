//client/src/pages/AdminSales.jsx
import { useEffect, useState } from "react";
import { getAdminOrders, archiveOrderApi } from "../services/api";
import { getToken } from "../utils/auth";
import { formatDate } from "../utils/formatDate";

export default function AdminSales() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTime, setRefreshTime] = useState(null);
  const [archivingOrderId, setArchivingOrderId] = useState(null);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminOrders(getToken());
      setOrders(data || []);
      setRefreshTime(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0,
  );

  async function handleArchive(orderId) {
    setArchivingOrderId(orderId);
    setError("");

    try {
      await archiveOrderApi(orderId, getToken());
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to archive order.");
    } finally {
      setArchivingOrderId(null);
    }
  }

  return (
    <div className="page">
      <div className="admin-sales-header">
        <div>
          <h1>Sales Report</h1>
          {refreshTime && (
            <p className="muted">
              Last refreshed:{" "}
              {formatDate(refreshTime, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        <div className="admin-sales-actions">
          <button type="button" onClick={loadOrders} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-low-stock" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div className="kpi-grid" style={{ marginBottom: 30 }}>
        <div className="kpi-card">
          <h4>Total Orders</h4>
          <div className="kpi-value">{orders.length}</div>
        </div>

        <div className="kpi-card">
          <h4>Total Revenue</h4>
          <div className="kpi-value">₦{totalSales.toLocaleString()}</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <p>No sales records available yet.</p>
        </div>
      ) : (
        <div className="admin-sales-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <strong>{order.orderNumber || "Order"}</strong>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {formatDate(order.createdAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleArchive(order._id)}
                  disabled={archivingOrderId === order._id}
                >
                  {archivingOrderId === order._id ? "Archiving…" : "Archive"}
                </button>
              </div>

              <div className="order-card-row">
                <span>Customer</span>
                <span>{order.customerName || order.email || "—"}</span>
              </div>

              <div className="order-card-row">
                <span>Amount</span>
                <span>₦{Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>

              <div className="order-card-row">
                <span>Payment</span>
                <span>{order.paymentStatus || "—"}</span>
              </div>

              <div className="order-card-row">
                <span>Delivery</span>
                <span>{order.deliveryStatus || "—"}</span>
              </div>

              <div className="order-card-row">
                <span>State / City</span>
                <span>
                  {order.state || "—"} / {order.city || "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
