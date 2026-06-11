import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <a className="cta" href="/refund-policy">
            Refund Policy
          </a>
          <a className="cta" href="/terms-conditions">
            Terms & Conditions
          </a>
          <a className="cta" href="/contact">
            Contact Support
          </a>
        </div>

        <h1>Privacy Policy</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email, phone, delivery address)</li>
          <li>Order, payment, shipping, and support records</li>
          <li>
            Device, browser, IP address, and app usage data needed for security
            and support
          </li>
          <li>
            Photos, notes, or measurement details you provide for custom orders
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process, confirm, and deliver orders</li>
          <li>Verify payment, handle refunds, and provide customer support</li>
          <li>
            Improve service quality, prevent fraud, and secure our systems
          </li>
          <li>
            Comply with applicable law, tax, accounting, and merchant-platform
            obligations
          </li>
        </ul>

        <h2>Sharing and Third Parties</h2>
        <p>
          We may share personal data only with payment processors, logistics
          partners, delivery providers, hosting providers, and support tools
          strictly needed to operate the store, including order confirmation,
          delivery, refund handling, and merchant-platform compliance. We do
          not sell your personal data. Where required, we will contractually
          require these providers to protect your information.
        </p>

        <h2>Retention and Security</h2>
        <p>
          We keep personal data for as long as needed to provide our services,
          resolve disputes, comply with legal obligations, and maintain records
          required by applicable Nigerian law and merchant platforms. We use
          reasonable technical and organizational safeguards, but no internet
          system is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may ask for access, correction, deletion, or restriction of
          certain personal data, and you may object to direct marketing or
          unnecessary processing, subject to applicable law. To exercise these
          rights, contact us through the Support page or email us at
          newbrend001@gmail.com.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy concerns, please use the{" "}
          <a href="/contact">Contact Support</a> page or email
          newbrend001@gmail.com.
        </p>
      </div>
    </>
  );
}
