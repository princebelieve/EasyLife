//client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img
            src="/logo.jpeg"
            alt="Newbrend Furniture"
            className="footer-logo"
          />

          <h3>Newbrend Furniture</h3>

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
              href="https://x.com/NewtonMM3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <SiX size={24} />
            </a>
            <a
              href="https://www.instagram.com/newbrend101?igsh=MWpuN2tlbG41cG5r"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@centnewton2?_r=1&_t=ZN-96wE1C2UMBb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="https://youtube.com/@newbrendfurnitureandinterior?si=FEgV3Y9AqdmDWuXs"
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
            Km 15, Agbor-Eku Road
            <br />
            Adjacent Matrix Filling Station
            <br />
            Abraka, Delta State Nigeria
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Newbrend Furniture. All rights reserved.
      </div>
    </footer>
  );
}
