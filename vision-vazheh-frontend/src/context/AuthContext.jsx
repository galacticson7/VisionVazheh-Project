// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // در آینده می‌توانیم اطلاعات کاربر را اینجا ذخیره کنیم
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

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
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// یک هوک سفارشی برای استفاده راحت‌تر
export const useAuth = () => {
  return useContext(AuthContext);
};