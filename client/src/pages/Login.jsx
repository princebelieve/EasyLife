//client/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";
import { setToken } from "../utils/auth";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await loginUser(form);

    if (res.token) {
      setToken(res.token);

      const payload = JSON.parse(atob(res.token.split(".")[1]));

      const pendingCheckout = localStorage.getItem("pendingCheckout");

      if (payload.role === "admin") {
        navigate("/admin/products");
      } else if (pendingCheckout === "true") {
        localStorage.removeItem("pendingCheckout");

        navigate("/checkout");
      } else {
        navigate("/dashboard");
      }
    } else {
      alert(res.message || "Login failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="form" style={{ marginTop: 50 }}>
        <h1>Login</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          Welcome back. Sign in to manage your products.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="password-field">
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

            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </div>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--gold)" }}>
            Register here
          </Link>
        </p>

        <p style={{ marginTop: 12, fontSize: 14 }}>
          <Link to="/forgot-password" style={{ color: "var(--gold)" }}>
            Forgot password?
          </Link>
        </p>
      </div>
    </>
  );
}
