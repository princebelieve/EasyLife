//client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

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
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok size={18} />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={18} />
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
