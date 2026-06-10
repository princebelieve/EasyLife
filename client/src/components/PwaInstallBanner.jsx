import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const deferredPrompt = window.__deferredPrompt;
    const isInstalled =
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;

    // show banner if either install prompt exists (Android) or it's iOS where we'll show instructions
    const isiOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.navigator.standalone;
    if (isInstalled) return;

    const dismissedFlag = localStorage.getItem("pwaInstallDismissed");
    if (dismissedFlag) return setDismissed(true);

    if (!deferredPrompt && !isiOS) return; // nothing to do for non-mobile install-capable browsers

    const timer = setTimeout(() => setVisible(true), 30000);

    return () => clearTimeout(timer);
  }, []);

  const deferredPrompt = window.__deferredPrompt;
  const isInstalled =
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;

  if (!visible || dismissed || isInstalled) return null;

  const handleInstall = async () => {
    // Android / Chrome flow
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        setVisible(false);
        localStorage.setItem("pwaInstallDismissed", "true");
        window.__deferredPrompt = null;
      }
    } else {
      // likely iOS - open the instructions page
      navigate("/install-instructions");
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem("pwaInstallDismissed", "true");
  };

  return (
    <div className="pwa-install-banner">
      <div className="pwa-banner-content">
        <Download size={20} className="pwa-banner-icon" />
        <div>
          <strong>Install NewBrend App</strong>
          <p>Get faster access — add NewBrend to your home screen</p>
        </div>
      </div>

      <div className="pwa-banner-actions">
        <button className="pwa-btn-enable" onClick={handleInstall}>
          Install
        </button>
        <button
          className="pwa-btn-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
