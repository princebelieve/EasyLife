//client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getMyOrders, getProfile } from "../services/api";
import useAuth from "../context/AuthContext";
import UserLayout from "../components/user/UserLayout";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const profile = await getProfile(token);
        setUser(profile.user);

        const ordersData = await getMyOrders(token);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <UserLayout>
      <div className="page">
        <div className="dashboard-hero">
          <div>
            <h1>Welcome back, {user?.name}</h1>

            <p className="muted">
              Manage your orders, profile, and account activity.
            </p>
          </div>

          <div className="dashboard-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="cart-summary">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>

          <div className="dashboard-actions">
            <button onClick={() => (window.location.href = "/cart")}>
              View Cart
            </button>

            <button onClick={() => (window.location.href = "/checkout")}>
              Continue Checkout
            </button>

            <button onClick={() => (window.location.href = "/profile")}>
              Edit Profile
            </button>

            <button onClick={() => (window.location.href = "/collection")}>
              Shop Furniture
            </button>
          </div>

          <div className="cart-summary">
            <h3>
              {orders.filter((o) => o.deliveryStatus !== "delivered").length}
            </h3>

            <p>Active Orders</p>
          </div>

          <div className="cart-summary">
            <h3>{user?.state || "N/A"}</h3>
            <p>State</p>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Account Information</h2>

          <p>
            <b>Email:</b> {user?.email}
          </p>

          <p>
            <b>Phone:</b> {user?.phone || "Not set"}
          </p>

          <p>
            <b>Address:</b> {user?.address || "Not set"}
          </p>
        </div>

        <h2 style={{ marginTop: 30 }}>Recent Orders</h2>

        {orders.map((order) => (
          <div key={order._id} className="cart-summary">
            <h3>₦{Number(order.totalAmount || 0).toLocaleString()}</h3>

            <p>Payment: {order.paymentStatus}</p>
            <p>Delivery: {order.deliveryStatus}</p>

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
    </UserLayout>
  );
}
