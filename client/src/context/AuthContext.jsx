//client/src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { getProfile } from "../services/api";
import { setRefreshToken } from "../utils/auth";

const AuthContext = createContext(null);

function parseToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setTokenState(null);

    setUser(null);
  }, []);

  const hydrateUser = useCallback(async () => {
    try {
      const profile = await getProfile();

      setUser(profile.user);
      setTokenState(localStorage.getItem("accessToken"));
    } catch (error) {
      console.error(error);

      logout();
    }
  }, [logout]);

  const updateToken = useCallback(
    async (newToken) => {
      localStorage.setItem("accessToken", newToken);

      const parsedUser = parseToken(newToken);

      if (!parsedUser) {
        logout();
        return;
      }

      setTokenState(newToken);

      await hydrateUser();
    },
    [logout, hydrateUser],
  );

  async function login(newToken, refreshToken) {
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    await updateToken(newToken);
  }

  useEffect(() => {
    async function syncAuth() {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        setTokenState(null);

        setUser(null);

        setLoading(false);

        return;
      }
      setTokenState(storedToken);

      await hydrateUser();

      setLoading(false);
    }

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [logout, hydrateUser]);

  const value = useMemo(() => {
    return {
      token,

      user,

      loading,

      isLoggedIn: !!user,

      isAdmin: user?.role === "admin",

      login,

      updateToken,

      logout,

      setUser,
    };
  }, [token, user, loading, updateToken, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
