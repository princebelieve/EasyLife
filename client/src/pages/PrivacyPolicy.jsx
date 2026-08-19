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
          Last updated: 2026-08-18
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Account information, such as your name, email address, phone number, and profile details</li>
          <li>Information about products, services, training, consultations, or support you request or purchase</li>
          <li>Payment, transaction, and customer-support records; payment details are processed by our payment providers</li>
          <li>Photos, documents, notes, or other information you choose to upload or submit</li>
          <li>
            Device, browser, IP address, and app usage data needed for security
            and support
          </li>
          <li>Information about push-notification subscriptions if you enable notifications</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Provide and manage our products, services, training, consultations, and support</li>
          <li>Process payments, registrations, requests, refunds, and related communications</li>
          <li>
            Verify accounts, send email notifications, prevent fraud, and secure our systems
          </li>
          <li>
            Improve our programs and services and comply with applicable law
          </li>
        </ul>

        <h2>Google Sign-In and Google Data</h2>
        <p>
          If you choose Google Sign-In, we receive the Google account
          information shown during sign-in, such as your name, email address,
          and profile image, to create or access your Easy Life Wellness Hub
          account. We use this information only to authenticate you and
          provide the account features you request. We do not sell Google user
          data or use it for advertising.
        </p>
        <p>
          Our server may also use Gmail API OAuth credentials belonging to Easy
          Life Wellness Hub to send account verification and password-reset
          emails. Those credentials are not used to read or access customers’
          Gmail accounts.
        </p>

        <h2>Sharing and Third Parties</h2>
        <p>
          We may share personal data with payment processors, email and
          notification providers, hosting and storage providers, service
          providers, and professional or operational partners where reasonably
          necessary to provide Easy Life Wellness Hub services, process a
          transaction, respond to you, or keep the Platform secure. We do not
          sell your personal data. We require service providers to handle your
          information only for appropriate business purposes and to protect it.
        </p>

        <h2>Retention and Security</h2>
        <p>
          We keep personal data for as long as needed to provide our services,
          manage your account, resolve disputes, meet legal and accounting
          obligations, and enforce our agreements. We use reasonable technical
          and organizational safeguards, but no internet system is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          Please also read our{" "}
          <a href="/terms-conditions">Terms & Conditions</a> and{" "}
          <a href="/refund-policy">Refund & Returns Policy</a> where
          applicable. Easy Life Wellness Hub is the business name used for
          these policies and related customer support.
        </p>
        <p>
          You may ask for access, correction, deletion, or restriction of
          certain personal data, and you may object to direct marketing or
          unnecessary processing, subject to applicable law. To exercise these
          rights, contact us through the Support page or email us at
          support@easylifewellnesshub.com.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy concerns, please use the{" "}
          <a href="/contact">Contact Support</a> page or email
          support@easylifewellnesshub.com.
        </p>
      </div>
    </>
  );
}
