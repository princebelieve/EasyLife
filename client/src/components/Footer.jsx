//client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img
            src="/logo.png"
            alt="Easy Life Wellness Hub"
            className="footer-logo"
          />

          <h3>Easy Life Wellness Hub (EWH)</h3>

          <p>Nature Cares & Healthy Living.</p>
        </div>

        <div>
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/collection">Shop Wellness Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/support">Support Guide</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/outreach">Outreach Activities</Link>
          <Link to="/journey">Stories Journey</Link>
        </div>

        <div>
          <h4>Customer</h4>

          <Link to="/dashboard">My Orders</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/contact">Support</Link>
        </div>

        <div>
          <h4>Policies</h4>

          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund & Returns</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </div>

        <div>
          <h4>Follow Us</h4>

          <div className="footer-social">
            <a
              href="https://www.facebook.com/share/19KyBKsDzg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://wa.me/2348089938820"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <SiX size={24} />
            </a>
            <a
            href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
            href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="https://www.youtube.com/@EasylifeWellnessHub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>

        <div>
          <h4>Address</h4>
          <p>
            Easylife Supermarket
            <br />
            Along Lucky Way Road
            <br />
            Benin City, Nigeria
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Easy Life Wellness Hub. All rights reserved.
      </div>
    </footer>
  );
}
