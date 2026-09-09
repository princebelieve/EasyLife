//client/src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
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
          alt="Easy Life Wellness Hub"
          className={`logo ${scrolled ? "hide-logo" : ""}`}
        />
        <span className="brand-name" aria-label="Easy Life Wellness Hub">
          <span>Easy Life</span>
          <span>Wellness Hub</span>
        </span>
      </Link>

      <div className="desktop-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/collection">Shop</Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "explore" ? null : "explore")} aria-expanded={activeDropdown === "explore"} aria-haspopup="true">
              Explore <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "explore" && <div className="nav-dropdown-menu" role="menu">
              <Link role="menuitem" to="/about" onClick={() => setActiveDropdown(null)}>About Easy Life</Link>
              <Link role="menuitem" to="/journey" onClick={() => setActiveDropdown(null)}>Our Journey</Link>
              <Link role="menuitem" to="/outreach" onClick={() => setActiveDropdown(null)}>Community Outreach</Link>
              <Link role="menuitem" to="/testimonials" onClick={() => setActiveDropdown(null)}>Testimonials</Link>
              <Link role="menuitem" to="/our-director" onClick={() => setActiveDropdown(null)}>Our Director</Link>
            </div>}
          </div>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" onClick={() => setActiveDropdown(activeDropdown === "visit" ? null : "visit")} aria-expanded={activeDropdown === "visit"} aria-haspopup="true">
              Visit <ChevronDown size={16} aria-hidden="true" />
            </button>
            {activeDropdown === "visit" && <div className="nav-dropdown-menu" role="menu">
              <a role="menuitem" href="https://clinic.easylifewellnesshub.com" target="_blank" rel="noreferrer">Easy Life Clinic</a>
              <a role="menuitem" href="https://supermarket.easylifewellnesshub.com" target="_blank" rel="noreferrer">Easy Life Supermarket</a>
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

          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}

          {isLoggedIn && user?.distributorStatus !== "approved" && user?.distributorStatus !== "pending" && <Link to="/dashboard?distributor=apply">Become a Distributor</Link>}

          {isLoggedIn && user?.distributorStatus === "approved" && <Link to="/distributor">Distributor Dashboard</Link>}

          {isAdminOrSubadmin && <Link to={isAdmin ? "/admin" : "/admin/products"}>{isAdmin ? "Admin" : "Workspace"}</Link>}

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
            className="cart-nav-button"
            onClick={() => navigate("/cart")}
            aria-label={`Cart${cartCount ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : " is empty"}`}
            title="Cart"
          >
            <ShoppingCart size={21} aria-hidden="true" />
            {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
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
            title="Install Easy Life App"
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

          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "explore" ? null : "explore")} aria-expanded={activeMobileSection === "explore"}>
              Explore <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "explore" && <div className="mobile-nav-submenu">
              <Link to="/about" onClick={() => setOpen(false)}>About Easy Life</Link>
              <Link to="/journey" onClick={() => setOpen(false)}>Our Journey</Link>
              <Link to="/outreach" onClick={() => setOpen(false)}>Community Outreach</Link>
              <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonials</Link>
              <Link to="/our-director" onClick={() => setOpen(false)}>Our Director</Link>
            </div>}
          </div>

          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-group-toggle" onClick={() => setActiveMobileSection(activeMobileSection === "visit" ? null : "visit")} aria-expanded={activeMobileSection === "visit"}>
              Visit <ChevronDown size={18} aria-hidden="true" />
            </button>
            {activeMobileSection === "visit" && <div className="mobile-nav-submenu">
              <a href="https://clinic.easylifewellnesshub.com" target="_blank" rel="noreferrer">Easy Life Clinic</a>
              <a href="https://supermarket.easylifewellnesshub.com" target="_blank" rel="noreferrer">Easy Life Supermarket</a>
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

          {isLoggedIn && <Link to="/notifications" onClick={() => setOpen(false)}>
            Notifications {unreadCount > 0 ? `(${unreadCount})` : ""}
          </Link>}

          {isLoggedIn && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                My Orders
              </Link>

              {user?.distributorStatus !== "approved" && user?.distributorStatus !== "pending" && (
                <Link to="/dashboard?distributor=apply" onClick={() => setOpen(false)}>
                  Become a Distributor
                </Link>
              )}

              {user?.distributorStatus === "approved" && (
                <Link to="/distributor" onClick={() => setOpen(false)}>
                  Distributor Dashboard
                </Link>
              )}

              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </>
          )}

          {isAdminOrSubadmin && (
            <Link to={isAdmin ? "/admin" : "/admin/products"} onClick={() => setOpen(false)}>
              {isAdmin ? "Admin" : "Workspace"}
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
