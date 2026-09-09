import { Link } from "react-router-dom";
import { FaFacebook, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="Easy Life Wellness Hub" className="footer-logo" />
          <h3>Easy Life Wellness Hub (EWH)</h3>
          <p>Nature Cares & Healthy Living.</p>
          <p className="footer-address">95, Akpakpava, Benin City, Edo State, Nigeria</p>
        </div>

        <nav className="footer-links" aria-label="Explore Easy Life">
          <h4>Explore</h4>
          <Link to="/collection">Shop Wellness Products</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/outreach">Outreach Activities</Link>
          <Link to="/journey">Stories Journey</Link>
          <Link to="/our-director">Meet Our Director</Link>
        </nav>

        <nav className="footer-links" aria-label="Customer links">
          <h4>Customer Care</h4>
          <Link to="/dashboard">My Orders</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/support">Support Guide</Link>
          <Link to="/how-to-use">How to Use Easy Life</Link>
        </nav>

        <div className="footer-contact">
          <h4>Contact & Follow</h4>
          <a href="mailto:support@easylifewellnesshub.com">support@easylifewellnesshub.com</a>
          <a href="tel:+2348089938820">08089938820</a>
          <a href="https://clinic.easylifewellnesshub.com" target="_blank" rel="noopener noreferrer">Visit Easy Life Clinic</a>
          <a href="https://supermarket.easylifewellnesshub.com" target="_blank" rel="noopener noreferrer">Visit Easy Life Supermarket</a>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/19KyBKsDzg/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook size={24} /></a>
            <a href="https://wa.me/2348089938820" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp size={24} /></a>
            <a href="https://www.youtube.com/@EasylifeWellnessHub" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={24} /></a>
            <a href="https://www.tiktok.com/@easy.life.wellnes6" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok size={24} /></a>
          </div>
        </div>
      </div>

      <div className="container footer-legal">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/refund-policy">Refund & Returns</Link>
        <Link to="/terms-conditions">Terms & Conditions</Link>
      </div>
      <div className="footer-bottom">(c) {new Date().getFullYear()} Easy Life Wellness Hub. All rights reserved.</div>
    </footer>
  );
}
