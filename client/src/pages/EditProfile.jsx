//client/src/pages/EditProfile.jsx
import { useEffect, useState } from "react";

import useAuth from "../context/AuthContext";

import { getProfile, updateProfile, changePassword } from "../services/api";

import UserLayout from "../components/user/UserLayout";

import AvatarUpload from "../components/AvatarUpload";

import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { token, setUser: setAuthUser } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const data = await getProfile(token);

        setUser(data.user);

        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          state: data.user.state || "",
        });
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [token]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await updateProfile(form, token);

      setUser(data.user);

      setAuthUser(data.user);

      alert("Profile updated");

      navigate("/profile");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handlePasswordChange(e) {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    // Validate inputs
    if (!passwordForm.currentPassword) {
      alert("Please enter your current password");
      return;
    }

    if (!passwordForm.newPassword) {
      alert("Please enter a new password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      alert("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <UserLayout>
      <div className="profile-page">
        <div className="profile-card">
          <h1 style={{ color: "var(--navy)", marginBottom: "24px" }}>
            Edit Profile
          </h1>

          <div className="profile-header">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div>
              <h2 style={{ margin: "0 0 8px 0", color: "var(--navy)" }}>
                {user?.name}
              </h2>

              <p style={{ margin: "4px 0", color: "var(--text)" }}>
                {user?.email}
              </p>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: user?.emailVerified ? "#4caf50" : "#f39c12",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {user?.emailVerified
                  ? "✓ Email verified"
                  : user?.pendingEmail
                    ? `Change pending: ${user.pendingEmail}`
                    : "⚠ Email not verified"}
              </p>
            </div>
          </div>

          <AvatarUpload
            onUploaded={(updatedUser) => {
              setUser(updatedUser);

              setAuthUser(updatedUser);
            }}
          />

          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Phone Number</span>
              <input
                type="text"
                name="phone"
                placeholder="+234 (0) 123 456 7890"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Address</span>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={form.address}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>City</span>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>State</span>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <div
            style={{
              borderTop: "1px solid #e0e0e0",
              marginTop: "32px",
              paddingTop: "32px",
            }}
          >
            <h2 style={{ color: "var(--navy)", marginBottom: "20px" }}>
              Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <label>
                <span>Current Password</span>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label>
                <span>New Password</span>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label>
                <span>Confirm New Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <button type="submit" disabled={changingPassword}>
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
