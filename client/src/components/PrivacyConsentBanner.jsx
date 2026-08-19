import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "easyLifePrivacyConsent";

export default function PrivacyConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function acceptPrivacy() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="privacy-consent-banner" role="dialog" aria-label="Privacy notice">
      <div className="privacy-consent-content">
        <strong>Your privacy matters to Easy Life.</strong>
        <p>
          We use account, order, support, and device information to provide
          wellness products, training, payments, and secure account services.
          Read our <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
      <div className="privacy-consent-actions">
        <Link className="privacy-consent-policy" to="/privacy-policy">
          Read Privacy Policy
        </Link>
        <button type="button" className="privacy-consent-accept" onClick={acceptPrivacy}>
          Accept
        </button>
      </div>
    </aside>
  );
}
