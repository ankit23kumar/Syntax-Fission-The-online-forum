// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access'));

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access', accessToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user, accessToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
