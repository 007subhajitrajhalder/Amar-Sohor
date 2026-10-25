import { createContext, useContext, useEffect, useState } from "react";
import {
  clearAuthSession,
  getMeApi,
  getStoredToken,
  getStoredUser,
  loginApi,
  registerApi,
  updateProfileApi,
  setAuthSession,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  // Validate token with backend on initial app load
  useEffect(() => {
    let isMounted = true;

    async function verifyExistingSession() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const freshUser = await getMeApi();
        if (isMounted) {
          setUser(freshUser);
          setAuthSession(storedToken, freshUser);
        }
      } catch (err) {
        console.warn("Session expired or invalid, logging out:", err.message);
        if (isMounted) {
          clearAuthSession();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifyExistingSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login method: authenticates, stores token and user state
  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    setAuthSession(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  // Register method: registers new user with backend
  const register = async ({ fullName, email, phone, password }) => {
    const newUser = await registerApi({ fullName, email, phone, password });
    return newUser;
  };

  // Update profile method: sends updated fields to backend and syncs state
  const updateProfile = async ({ fullName, email, phone }) => {
    const updatedUser = await updateProfileApi({ fullName, email, phone });
    const mergedUser = {
      ...(user || {}),
      ...updatedUser,
    };
    setUser(mergedUser);
    setAuthSession(token, mergedUser);
    return mergedUser;
  };

  // Logout method: clears token and user from storage and state
  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
