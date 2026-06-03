import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getNotifications,
  markNotificationRead as markNotificationReadApi,
  markAllNotificationsRead as markAllNotificationsReadApi,
} from "../services/api";
import useAuth from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { token, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!token || !isLoggedIn) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getNotifications();
      setNotifications(
        Array.isArray(data.notifications) ? data.notifications : [],
      );
    } catch (err) {
      console.error("Unable to load notifications", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Update PWA app badge with unread count
  useEffect(() => {
    if ("setAppBadge" in navigator) {
      const count = notifications.filter((n) => !n.read).length;
      if (count > 0) {
        navigator.setAppBadge(count);
      } else {
        navigator.clearAppBadge();
      }
    }
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, read: true } : item)),
      );
    } catch (err) {
      console.error("Unable to mark notification read", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (err) {
      console.error("Unable to mark all notifications read", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      loading,
      error,
      unreadCount,
      fetchNotifications,
      markNotificationRead,
      markAllAsRead,
    }),
    [
      error,
      fetchNotifications,
      loading,
      markAllAsRead,
      markNotificationRead,
      notifications,
      unreadCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
