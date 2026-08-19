import { Link } from "react-router-dom";

export default function PwaInstallInstructions() {
  return (
    <div className="container" style={{ padding: 28 }}>
      <h1>Install Easy Life App</h1>
      <p>
        On iOS (Safari), add Easy Life to your home screen to use it like an app.
      </p>

      <ol>
        <li>Open this page in Safari.</li>
        <li>Tap the Share button (the square with an arrow).</li>
        <li>Choose "Add to Home Screen".</li>
        <li>Confirm — the Easy Life icon will appear on your home screen.</li>
      </ol>

      <p>
        Once added, open the app from your home screen and it will run in
        standalone mode.
      </p>

      <Link to="/" className="cta">
        Back to site
      </Link>
    </div>
  );
}
