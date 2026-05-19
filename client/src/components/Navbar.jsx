//client/src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../context/AuthContext";
import useClickOutside from "../hooks/useClickOutside";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useClickOutside({ current: [menuRef.current, buttonRef.current] }, () =>
    setOpen(false),
  );

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
          src="/logo.jpeg"
          alt="NewBrend Furniture"
          className={`logo ${scrolled ? "hide-logo" : ""}`}
        />
        <span className="brand-name">
          NewBrend Furniture
          <br className="mobile-break" />& Interior
        </span>
      </Link>

      <div className="desktop-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/collection">Show Room</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          <Link to="/cart">Cart</Link>

          {isLoggedIn && <Link to="/dashboard">My Orders</Link>}

          {isAdmin && <Link to="/admin/products">Admin</Link>}

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
            Show Room
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

          {isLoggedIn && (
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              My Orders
            </Link>
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
