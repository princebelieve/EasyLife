//client/src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

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

  const updateToken = useCallback(
    (newToken) => {
      localStorage.setItem("accessToken", newToken);

      const parsedUser = parseToken(newToken);

      if (!parsedUser) {
        logout();
        return;
      }

      setTokenState(newToken);
      setUser(parsedUser);
    },
    [logout],
  );

  function login(newToken) {
    updateToken(newToken);
  }

  useEffect(() => {
    function syncAuth() {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        setTokenState(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const parsedUser = parseToken(storedToken);

      if (!parsedUser || parsedUser.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      setTokenState(storedToken);
      setUser(parsedUser);
      setLoading(false);
    }

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [logout]);

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
    };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
