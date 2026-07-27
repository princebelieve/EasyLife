//client/src/components/AvatarUpload.jsx
import { useState } from "react";
import useAuth from "../context/AuthContext";
import { uploadAvatar } from "../services/api";

export default function AvatarUpload({ onUploaded }) {
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  async function handleChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const data = await uploadAvatar(file, token);

      onUploaded?.(data.user);

      alert("Avatar uploaded");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="avatar-upload">
      <input type="file" accept="image/*" onChange={handleChange} />

      {loading && <p>Uploading...</p>}
    </div>
  );
}
