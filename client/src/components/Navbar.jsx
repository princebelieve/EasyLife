//client/src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, ShoppingBasket, ShoppingCart, X } from "lucide-react";
import { Download } from "lucide-react";
import useAuth from "../context/AuthContext";
import useClickOutside from "../hooks/useClickOutside";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isAdmin, isAdminOrSubadmin, logout, user } = useAuth();
  const { cartCount } = useCart();
  const { unreadCount } = useNotifications();

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Detect PWA installability and iOS state
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // store globally so other components can read it
      window.__deferredPrompt = e;
    };

    const installedHandler = () => setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    // detect standalone (iOS added to home screen)
    if (
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  useEffect(() => {
    const updateMobile = () => {
      if (window.matchMedia) {
        setIsMobileScreen(window.matchMedia("(max-width: 900px)").matches);
      }
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);

    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useClickOutside([menuRef, buttonRef], () => setOpen(false), open);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleLogout() {
    logout();
    navigate("/login");
    setOpen(false);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
        <img
          src="/logo.png"
          alt="EASYLIFE WELLNESS HUB"
          className={`logo ${scrolled ? "hide-logo" : ""}`}
        />
        <span className="brand-name" aria-label="EASYLIFE WELLNESS HUB">
          <span>EASYLIFE</span>
          <span>WELLNESS HUB</span>
        </span>
      </Link>

      <div className="desktop-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "explore" ? null : "explore")} aria-expanded={activeDropdown === "explore"} aria-haspopup="true">
              Explore <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "explore" && <div className="nav-dropdown-menu" role="menu">
              <Link role="menuitem" to="/about" onClick={() => setActiveDropdown(null)}>About EASYLIFE</Link>
              <Link role="menuitem" to="/journey" onClick={() => setActiveDropdown(null)}>Our Journey</Link>
              <Link role="menuitem" to="/outreach" onClick={() => setActiveDropdown(null)}>Community Outreach</Link>
              <Link role="menuitem" to="/testimonials" onClick={() => setActiveDropdown(null)}>Testimonials</Link>
              <Link role="menuitem" to="/our-director" onClick={() => setActiveDropdown(null)}>Our Director</Link>
              <a role="menuitem" href="https://clinic.easylifewellnesshub.com" target="_blank" rel="noreferrer">Visit EASYLIFE Clinic</a>
              <a role="menuitem" href="https://supermarket.easylifewellnesshub.com" target="_blank" rel="noreferrer">Visit EASYLIFE Supermarket</a>
            </div>}
          </div>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "help" ? null : "help")} aria-expanded={activeDropdown === "help"} aria-haspopup="true">
              Help <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "help" && <div className="nav-dropdown-menu" role="menu">
              <Link role="menuitem" to="/how-to-use" onClick={() => setActiveDropdown(null)}>How It Works</Link>
              <Link role="menuitem" to="/support" onClick={() => setActiveDropdown(null)}>Support Guide</Link>
              <Link role="menuitem" to="/contact" onClick={() => setActiveDropdown(null)}>Contact Us</Link>
              <Link role="menuitem" to="/refund-policy" onClick={() => setActiveDropdown(null)}>Returns & Refunds</Link>
              <Link role="menuitem" to="/terms-conditions" onClick={() => setActiveDropdown(null)}>Terms & Conditions</Link>
              <Link role="menuitem" to="/privacy-policy" onClick={() => setActiveDropdown(null)}>Privacy Policy</Link>
            </div>}
          </div>

          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "account" ? null : "account")} aria-expanded={activeDropdown === "account"} aria-haspopup="true">
              {isLoggedIn ? "Dashboard" : "Account"} <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "account" && <div className="nav-dropdown-menu" role="menu">
              {isLoggedIn ? <>
                <Link role="menuitem" to="/dashboard" onClick={() => setActiveDropdown(null)}>Dashboard</Link>
                {user?.distributorStatus !== "approved" && user?.distributorStatus !== "pending" && <Link role="menuitem" to="/dashboard?distributor=apply" onClick={() => setActiveDropdown(null)}>Become a Distributor</Link>}
                <Link role="menuitem" to="/profile" onClick={() => setActiveDropdown(null)}>Profile</Link>
                <Link role="menuitem" to="/notifications" onClick={() => setActiveDropdown(null)}>Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}</Link>
                {user?.distributorStatus === "approved" && <Link role="menuitem" to="/distributor" onClick={() => setActiveDropdown(null)}>Distributor Dashboard</Link>}
                <button type="button" role="menuitem" onClick={handleLogout}>Logout</button>
              </> : <>
                <Link role="menuitem" to="/login" onClick={() => setActiveDropdown(null)}>Login</Link>
                <Link role="menuitem" to="/register" onClick={() => setActiveDropdown(null)}>Create an account</Link>
              </>}
            </div>}
          </div>

          {isAdminOrSubadmin && <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "admin" ? null : "admin")} aria-expanded={activeDropdown === "admin"} aria-haspopup="true">
              {isAdmin ? "Admin" : "Workspace"} <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "admin" && <div className="nav-dropdown-menu nav-dropdown-menu-scroll" role="menu">
              {isAdmin && <>
                <Link role="menuitem" to="/admin" onClick={() => setActiveDropdown(null)}>Admin Overview</Link>
                <Link role="menuitem" to="/admin/orders" onClick={() => setActiveDropdown(null)}>Orders</Link>
                <Link role="menuitem" to="/admin/distributors" onClick={() => setActiveDropdown(null)}>Distributors</Link>
                <Link role="menuitem" to="/admin/sales" onClick={() => setActiveDropdown(null)}>Sales</Link>
                <Link role="menuitem" to="/admin/stock" onClick={() => setActiveDropdown(null)}>Stock Alerts</Link>
                <Link role="menuitem" to="/admin/delivery" onClick={() => setActiveDropdown(null)}>Delivery Board</Link>
                <Link role="menuitem" to="/admin/shipping" onClick={() => setActiveDropdown(null)}>Shipping Zones</Link>
                <Link role="menuitem" to="/admin/transport-companies" onClick={() => setActiveDropdown(null)}>Transport Companies</Link>
                <Link role="menuitem" to="/admin/payment-settings" onClick={() => setActiveDropdown(null)}>Payment Settings</Link>
                <Link role="menuitem" to="/admin/inquiries" onClick={() => setActiveDropdown(null)}>Customer Inquiries</Link>
                <Link role="menuitem" to="/admin/users" onClick={() => setActiveDropdown(null)}>Users</Link>
              </>}
              <Link role="menuitem" to="/admin/products" onClick={() => setActiveDropdown(null)}>Products</Link>
              <Link role="menuitem" to="/admin/content" onClick={() => setActiveDropdown(null)}>Content Studio</Link>
              <Link role="menuitem" to="/admin/send-notification" onClick={() => setActiveDropdown(null)}>Send Notification</Link>
            </div>}
          </div>}
        </div>

        <div className="nav-actions">
          <NotificationDropdown />

          <button
            type="button"
            className="products-nav-button"
            onClick={() => navigate("/collection")}
            aria-label="Shop products"
            title="Shop products"
          >
            <ShoppingBasket size={21} aria-hidden="true" />
            <span>Shop products</span>
          </button>

          <button
            type="button"
            className="cart-nav-button"
            onClick={() => navigate("/cart")}
            aria-label={`Cart${cartCount ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : " is empty"}`}
            title="Cart"
          >
            <ShoppingCart size={21} aria-hidden="true" />
            {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
          </button>

        </div>
      </div>

      <div className="mobile-nav-actions">
        <button
          type="button"
          className="products-nav-button"
          onClick={() => navigate("/collection")}
          aria-label="Shop products"
          title="Shop products"
        >
          <ShoppingBasket size={21} aria-hidden="true" />
          <span>Shop products</span>
        </button>
        <button
          type="button"
          className="cart-nav-button"
          onClick={() => navigate("/cart")}
          aria-label={`Cart${cartCount ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : " is empty"}`}
          title="Cart"
        >
          <ShoppingCart size={21} aria-hidden="true" />
          {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
        </button>
        {isLoggedIn && (
          <NotificationBell
            count={unreadCount}
            onClick={() => navigate("/notifications")}
          />
        )}
        {/* PWA install icon (mobile only, only when not installed) */}
        {isMobileScreen && !isInstalled && (
          <button
            type="button"
            className="install-btn"
            onClick={async () => {
              const isiOS =
                /iphone|ipad|ipod/i.test(navigator.userAgent) &&
                !window.navigator.standalone;

              if (isiOS) {
                navigate("/install-instructions");
                return;
              }

              if (deferredPrompt) {
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                if (choice && choice.outcome === "accepted") {
                  setDeferredPrompt(null);
                  window.__deferredPrompt = null;
                  setIsInstalled(true);
                }
                return;
              }

              if (typeof window !== "undefined") {
                window.alert(
                  "Open this page in Chrome and tap the menu (⋮) → Add to Home screen to install the app.",
                );
              }
            }}
            aria-label="Install app"
            title="Install EASYLIFE App"
          >
            <Download size={20} />
          </button>
        )}
      </div>

      <button
        ref={buttonRef}
        type="button"
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={30} /> : <Menu size={30} />}
      </button>

      <div
        ref={menuRef}
        className={`mobile-menu-overlay ${open ? "active" : ""}`}
      >
        <div className="mobile-menu-links">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "explore" ? null : "explore")} aria-expanded={activeMobileSection === "explore"}>
              Explore <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "explore" && <div className="mobile-nav-submenu">
              <Link to="/about" onClick={() => setOpen(false)}>About EASYLIFE</Link>
              <Link to="/journey" onClick={() => setOpen(false)}>Our Journey</Link>
              <Link to="/outreach" onClick={() => setOpen(false)}>Community Outreach</Link>
              <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonials</Link>
              <Link to="/our-director" onClick={() => setOpen(false)}>Our Director</Link>
              <a href="https://clinic.easylifewellnesshub.com" target="_blank" rel="noreferrer">Visit EASYLIFE Clinic</a>
              <a href="https://supermarket.easylifewellnesshub.com" target="_blank" rel="noreferrer">Visit EASYLIFE Supermarket</a>
            </div>}
          </div>

          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "help" ? null : "help")} aria-expanded={activeMobileSection === "help"}>
              Help <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "help" && <div className="mobile-nav-submenu">
              <Link to="/how-to-use" onClick={() => setOpen(false)}>How It Works</Link>
              <Link to="/support" onClick={() => setOpen(false)}>Support Guide</Link>
              <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
              <Link to="/refund-policy" onClick={() => setOpen(false)}>Returns & Refunds</Link>
              <Link to="/terms-conditions" onClick={() => setOpen(false)}>Terms & Conditions</Link>
              <Link to="/privacy-policy" onClick={() => setOpen(false)}>Privacy Policy</Link>
            </div>}
          </div>

          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "account" ? null : "account")} aria-expanded={activeMobileSection === "account"}>
              {isLoggedIn ? "Dashboard" : "Account"} <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "account" && <div className="mobile-nav-submenu">
              {isLoggedIn ? <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard &amp; orders</Link>
                {user?.distributorStatus !== "approved" && user?.distributorStatus !== "pending" && <Link to="/dashboard?distributor=apply" onClick={() => setOpen(false)}>Become a Distributor</Link>}
                <Link to="/notifications" onClick={() => setOpen(false)}>Notifications {unreadCount > 0 ? `(${unreadCount})` : ""}</Link>
                <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
                {user?.distributorStatus === "approved" && <Link to="/distributor" onClick={() => setOpen(false)}>Distributor Dashboard</Link>}
                <button type="button" className="mobile-logout" onClick={handleLogout}>Logout</button>
              </> : <>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)}>Create an account</Link>
              </>}
          </div>}
          </div>

          {isAdminOrSubadmin && <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "admin" ? null : "admin")} aria-expanded={activeMobileSection === "admin"}>
              {isAdmin ? "Admin" : "Workspace"} <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "admin" && <div className="mobile-nav-submenu">
              {isAdmin && <>
                <Link to="/admin" onClick={() => setOpen(false)}>Admin Overview</Link><Link to="/admin/orders" onClick={() => setOpen(false)}>Orders</Link><Link to="/admin/distributors" onClick={() => setOpen(false)}>Distributors</Link><Link to="/admin/sales" onClick={() => setOpen(false)}>Sales</Link><Link to="/admin/stock" onClick={() => setOpen(false)}>Stock Alerts</Link><Link to="/admin/delivery" onClick={() => setOpen(false)}>Delivery Board</Link><Link to="/admin/shipping" onClick={() => setOpen(false)}>Shipping Zones</Link><Link to="/admin/transport-companies" onClick={() => setOpen(false)}>Transport Companies</Link><Link to="/admin/payment-settings" onClick={() => setOpen(false)}>Payment Settings</Link><Link to="/admin/inquiries" onClick={() => setOpen(false)}>Customer Inquiries</Link><Link to="/admin/users" onClick={() => setOpen(false)}>Users</Link>
              </>}
              <Link to="/admin/products" onClick={() => setOpen(false)}>Products</Link><Link to="/admin/content" onClick={() => setOpen(false)}>Content Studio</Link><Link to="/admin/send-notification" onClick={() => setOpen(false)}>Send Notification</Link>
            </div>}
          </div>}
        </div>
      </div>
    </nav>
  );
}
