//client/src/components/AvatarUpload.jsx
import { useState } from "react";

import { uploadAvatar } from "../services/userService";

export default function AvatarUpload({ onUploaded }) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const data = await uploadAvatar(file);

      onUploaded?.(data.user);

      alert("Avatar uploaded");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />

      {loading && <p>Uploading...</p>}
    </div>
  );
}
