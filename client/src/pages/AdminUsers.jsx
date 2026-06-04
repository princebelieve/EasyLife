import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import { getAdminUsers, updateAdminUser } from "../services/api";
import { formatDate } from "../utils/formatDate";

export default function AdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminUsers(token);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function toggleSuspend(user) {
    try {
      await updateAdminUser(
        user._id,
        { isSuspended: !user.isSuspended },
        token,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isSuspended: !u.isSuspended } : u,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleDelete(user) {
    try {
      await updateAdminUser(user._id, { isDeleted: !user.isDeleted }, token);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isDeleted: !u.isDeleted } : u,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="admin-card">Loading users...</div>;

  return (
    <div>
      <h1 className="title">Users</h1>

      {users.length === 0 ? (
        <div className="admin-card">No users found</div>
      ) : (
        <div className="admin-grid">
          {users.map((u) => (
            <div key={u._id} className="admin-card">
              <h3>{u.name || "(no name)"}</h3>
              <p>
                <strong>ID:</strong> {u._id}
              </p>
              <p>{u.email}</p>
              <p>
                <strong>Role:</strong> {u.role}
              </p>
              <p>
                <strong>Joined:</strong> {formatDate(u.createdAt)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {u.isDeleted
                  ? "Deleted"
                  : u.isSuspended
                    ? "Suspended"
                    : "Active"}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => toggleSuspend(u)} className="btn">
                  {u.isSuspended ? "Restore" : "Suspend"}
                </button>

                <button
                  onClick={() => toggleDelete(u)}
                  className="btn btn-danger"
                >
                  {u.isDeleted ? "Restore" : "Soft Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
