//client/src/pages/Register.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(
        "Account created successfully. Please check your email to verify your address.",
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ THIS WAS WHAT YOU WERE MISSING */}
      <div className="form" style={{ marginTop: 50 }}>
        <h1>Create Account</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          Join us to start managing your products.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />

            {/* Policy Checkboxes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 10,
                fontSize: 14,
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                I agree to the{" "}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  Privacy Policy
                </Link>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                I agree to the{" "}
                <Link
                  to="/terms-conditions"
                  target="_blank"
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !acceptedPrivacy || !acceptedTerms}
              style={{
                marginTop: 16,
                opacity:
                  submitting || !acceptedPrivacy || !acceptedTerms ? 0.5 : 1,
                cursor:
                  submitting || !acceptedPrivacy || !acceptedTerms
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
            <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
              By creating an account, you agree to our{" "}
              <Link to="/privacy-policy" style={{ color: "var(--gold)" }}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms-conditions" style={{ color: "var(--gold)" }}>
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--gold)" }}>
            Login here
          </Link>
        </p>
      </div>
    </>
  );
}
