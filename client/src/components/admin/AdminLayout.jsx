//client/src/components/admin/AdminLayout.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="admin-layout">
      {/* TOP BAR */}
      <div className="admin-topbar">
        <button onClick={() => setOpen(!open)} className="admin-menu-btn">
          {open ? <X /> : <Menu />}
        </button>

        <h2>Admin Panel</h2>

        <button onClick={handleLogout} className="admin-logout">
          Logout
        </button>
      </div>

      <div className="admin-body">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${open ? "open" : ""}`}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
        </aside>

        {/* MAIN CONTENT */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
