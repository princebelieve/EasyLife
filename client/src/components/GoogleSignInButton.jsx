import { useEffect, useRef, useState } from "react";

export default function GoogleSignInButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (!clientId) {
      setError("Google sign-in not configured.");
      return;
    }

    let mounted = true;
    let attempt = 0;

    const initializeGoogleButton = () => {
      if (!mounted) return;
      if (!window.google?.accounts?.id) {
        attempt += 1;

        if (attempt > 30) {
          setError("Google sign-in is unavailable right now.");
          return;
        }

        window.setTimeout(initializeGoogleButton, 100);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              return onError?.("Google sign-in failed. Please try again.");
            }

            try {
              await onSuccess(response.credential);
            } catch (err) {
              onError?.(err?.message || "Unable to complete Google sign-in.");
            }
          },
          ux_mode: "popup",
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
          });
        }

        setIsReady(true);
      } catch (err) {
        setError("Unable to initialize Google sign-in.");
      }
    };

    initializeGoogleButton();

    return () => {
      mounted = false;
    };
  }, [clientId, onError, onSuccess]);

  return (
    <div style={{ width: "100%", marginTop: 16 }}>
      {error ? (
        <button
          disabled
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "16px",
            border: "1px solid #d1d5db",
            background: "#f3f4f6",
            color: "#111827",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {error}
        </button>
      ) : (
        <div ref={buttonRef} />
      )}
      {!error && !isReady ? (
        <div
          style={{
            width: "100%",
            marginTop: 12,
            textAlign: "center",
            color: "#666",
            fontSize: 14,
          }}
        >
          Loading Google sign-in...
        </div>
      ) : null}
    </div>
  );
}
