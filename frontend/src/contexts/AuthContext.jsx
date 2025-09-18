// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access'));

  // --- NEW: The centralized login function ---
  const login = (userData) => {
    // 1. Update the React state
    setUser(userData);
    setAccessToken(userData.access);

    // 2. Persist the data to localStorage
    localStorage.setItem('access', userData.access);
    localStorage.setItem('refresh', userData.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // The logout function is already correct
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  };

  // This effect is no longer strictly necessary if all auth changes go through login/logout,
  // but it's good practice to keep it for safety.
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access', accessToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user, accessToken]);

  return (
    // Add the new login function to the context value
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);