//client/src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();
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
          alt="Easy Life Wellness Hub"
          className={`logo ${scrolled ? "hide-logo" : ""}`}
        />
        <span className="brand-name">
          Easy Life Wellness Hub
        </span>
      </Link>

      <div className="desktop-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/collection">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          <Link to="/cart">Cart</Link>

          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}

          {isAdmin && <Link to="/admin">Admin</Link>}

          {!isLoggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        <div className="nav-actions">
          <NotificationDropdown />

          <button
            type="button"
            className="cart-btn"
            onClick={() => navigate("/cart")}
          >
            Cart ({cartCount})
          </button>

          <button
            type="button"
            className="cta"
            onClick={() => navigate("/contact")}
          >
            Order Now
          </button>
        </div>
      </div>

      <div className="mobile-nav-actions">
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
            title="Install NewBrend App"
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

          <Link to="/collection" onClick={() => setOpen(false)}>
            Shop
          </Link>

          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <Link to="/cart" onClick={() => setOpen(false)}>
            Cart ({cartCount})
          </Link>

          <Link to="/notifications" onClick={() => setOpen(false)}>
            Notifications {unreadCount > 0 ? `(${unreadCount})` : ""}
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                My Orders
              </Link>

              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin/products" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>

              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <button
              type="button"
              className="mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
