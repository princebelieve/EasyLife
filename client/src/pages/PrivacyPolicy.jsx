import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <h1>Privacy Policy</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email, phone)</li>
          <li>Shipping and billing addresses</li>
          <li>Order history and payment transaction metadata</li>
          <li>Device and browser information for analytics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill orders</li>
          <li>Communicate about orders and support</li>
          <li>Improve our services and personalization</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Sharing and Third Parties</h2>
        <p>
          We share personal information with payment processors, shipping
          partners, and service providers that perform services on our behalf.
          We do not sell personal information to third parties.
        </p>

        <h2>Security</h2>
        <p>
          We implement reasonable technical and organizational measures to
          protect personal data. However, no system is completely secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access, corrections, or deletion of your personal data
          by contacting support@newbrend.example.
        </p>

        <h2>Contact</h2>
        <p>For privacy concerns, contact support@newbrend.example.</p>
      </div>
    </>
  );
}
