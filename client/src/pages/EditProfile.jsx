//client/src/pages/EditProfile.jsx
import { useEffect, useState } from "react";

import useAuth from "../context/AuthContext";

import { getProfile, updateProfile } from "../services/api";

import UserLayout from "../components/user/UserLayout";

import AvatarUpload from "../components/AvatarUpload";

import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { token, setUser: setAuthUser } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
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

  return (
    <UserLayout>
      <div className="profile-page">
        <div className="profile-card">
          <h1>Edit Profile</h1>

          <div className="profile-header">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div>
              <h2>{user?.name}</h2>

              <p>{user?.email}</p>
              <p style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
                {user?.emailVerified
                  ? "Email verified"
                  : user?.pendingEmail
                    ? `Change pending: ${user.pendingEmail}`
                    : "Email not verified"}
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
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
