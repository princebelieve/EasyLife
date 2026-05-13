//client/src/pages/AdminDashboard.jsx
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <>
      <>
        <Navbar />

        <div className="admin-grid">
          <div className="admin-card">
            <h3>Products</h3>
            <p>Manage inventory, stock, pricing</p>
          </div>

          <div className="admin-card">
            <h3>Orders</h3>
            <p>Track and update customer orders</p>
          </div>

          <div className="admin-card">
            <h3>Sales</h3>
            <p>Monitor revenue and transactions</p>
          </div>

          <div className="admin-card">
            <h3>Inquiries</h3>
            <p>Customer requests and messages</p>
          </div>
        </div>
      </>
    </>
  );
}
