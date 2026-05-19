//client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import { getProfile } from "../services/api";
import UserLayout from "../components/user/UserLayout";

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const data = await getProfile(token);
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [token]);

  return (
    <UserLayout>
      <div className="page">
        <h1>My Profile</h1>

        <div className="cart-summary">
          <p>
            <b>Name:</b> {user?.name}
          </p>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          <p>
            <b>Phone:</b> {user?.phone}
          </p>
          <p>
            <b>Address:</b> {user?.address}
          </p>
          <p>
            <b>City:</b> {user?.city}
          </p>
          <p>
            <b>State:</b> {user?.state}
          </p>
        </div>
      </div>
    </UserLayout>
  );
}
