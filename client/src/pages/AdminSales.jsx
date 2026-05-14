//client/src/pages/AdminSales.jsx
import { useEffect, useState } from "react";
import { getAdminOrders } from "../services/api";
import { getToken } from "../utils/auth";

export default function AdminSales() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAdminOrders(getToken()).then(setOrders);
  }, []);

  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0,
  );

  return (
    <>
      <div className="page">
        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Orders</h4>

            <div className="kpi-value">{orders.length}</div>
          </div>

          <div className="kpi-card">
            <h4>Total Revenue</h4>

            <div className="kpi-value">₦{totalSales.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
