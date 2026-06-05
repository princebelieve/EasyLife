//client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img
            src="/logo.jpeg"
            alt="NewBrend Furniture"
            className="footer-logo"
          />

          <h3>NewBrend Furniture</h3>

          <p>Premium furniture and bespoke interior design.</p>
        </div>

        <div>
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/collection">Show Room</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Customer</h4>

          <Link to="/dashboard">My Orders</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div>
          <h4>Follow Us</h4>

          <div className="footer-social">
            <a
              href="https://x.com/newbrendfurniture"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <FaX size={24} />
            </a>
            <a
              href="https://www.instagram.com/newbrendfurniture"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@newbrendfurniture"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} NewBrend Furniture. All rights reserved.
      </div>
    </footer>
  );
}
