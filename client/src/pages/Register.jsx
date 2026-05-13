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
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to connect to server");
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

            <button type="submit" className="btn-primary">
              Create Account
            </button>
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
