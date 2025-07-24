// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axiosInstance.get('/users/me/');
          setUser(response.data);
        } catch (error) {
           console.error("Failed to fetch user:", error);
           if (error.response?.status === 401) {
             logout();
           }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [accessToken]);

  const login = (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setAccessToken(tokens.access);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
    // Ensure redirect happens
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};