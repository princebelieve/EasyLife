import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { normalizeNotificationLink, openNotificationLink } from "../utils/notificationLinks";

export default function Notifications() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    unreadCount,
    markNotificationRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleOpenNotification = async (notification) => {
    const target = openNotificationLink(notification.link);

    if (typeof target === "string" && /^https?:|^mailto:/i.test(target)) {
      window.open(target, "_blank", "noopener,noreferrer");
    } else if (typeof target === "string") {
      navigate(normalizeNotificationLink(target));
    }

    if (!notification.read) {
      await markNotificationRead(notification._id);
    }
  };

  return (
    <div className="notifications-page">
      <header className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>

        <button type="button" onClick={markAllAsRead} disabled={loading}>
          Mark all read
        </button>
      </header>

      {loading && <p>Loading notifications...</p>}
      {!loading && notifications.length === 0 && (
        <p className="empty-state">No notifications yet.</p>
      )}

      <div className="notification-list">
        {notifications.map((notification) => (
          <article
            key={notification._id}
            className={`notification-item ${notification.read ? "read" : "unread"}`}
            onClick={() => handleOpenNotification(notification)}
            style={{ cursor: notification.link ? "pointer" : "default" }}
          >
            <div className="notification-content">
              <strong>{notification.title || "Notification"}</strong>
              <p>{notification.body}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>

            {!notification.read ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  markNotificationRead(notification._id);
                }}
              >
                Mark read
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
