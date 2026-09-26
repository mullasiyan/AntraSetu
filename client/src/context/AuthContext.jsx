import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('antarsetu_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('antarsetu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (token) {
        try {
          const res = await api.auth.me();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('antarsetu_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    verify();

    const handleAuthChange = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('antarsetu_auth_change', handleAuthChange);
    return () => window.removeEventListener('antarsetu_auth_change', handleAuthChange);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('antarsetu_token', res.token);
      localStorage.setItem('antarsetu_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('antarsetu_token');
    localStorage.removeItem('antarsetu_user');
    window.dispatchEvent(new Event('antarsetu_auth_change'));
  };

  const switchDemoRole = async (email) => {
    return login(email, 'antarsetu123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
