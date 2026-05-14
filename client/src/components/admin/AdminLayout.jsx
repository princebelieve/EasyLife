//client/src/components/admin/AdminLayout.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  Truck,
  MessageSquare,
  Home,
  User,
  LogOut,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const { logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const links = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      to: "/admin/products",
      label: "Products",
      icon: <Package size={18} />,
    },

    {
      to: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart size={18} />,
    },

    {
      to: "/admin/sales",
      label: "Sales",
      icon: <BarChart3 size={18} />,
    },

    {
      to: "/admin/stock",
      label: "Stock Alerts",
      icon: <AlertTriangle size={18} />,
    },

    {
      to: "/admin/delivery",
      label: "Delivery Board",
      icon: <Truck size={18} />,
    },

    {
      to: "/admin/inquiries",
      label: "Inquiries",
      icon: <MessageSquare size={18} />,
    },

    {
      to: "/dashboard",
      label: "Personal Dashboard",
      icon: <User size={18} />,
    },

    {
      to: "/",
      label: "Home",
      icon: <Home size={18} />,
    },
  ];

  return (
    <div className="admin-shell">
      {/* TOPBAR */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={24} />
          </button>

          <Link to="/admin" className="admin-brand">
            <img src="/logo.jpeg" alt="logo" className="admin-logo" />

            <div>
              <strong>NewBrend</strong>

              <span>Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* DESKTOP QUICK NAV */}
        <nav className="admin-desktop-nav">
          <Link to="/admin">Dashboard</Link>

          <Link to="/admin/products">Products</Link>

          <Link to="/admin/orders">Orders</Link>

          <Link to="/admin/sales">Sales</Link>
        </nav>

        <button onClick={handleLogout} className="admin-logout">
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="admin-sidebar-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                location.pathname === link.to ? "active-admin-link" : ""
              }
            >
              {link.icon}

              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="admin-main">{children}</main>
    </div>
  );
}
