import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth headers for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Fetch current logged in user details & stats
  const fetchUser = useCallback(async (tokenVal) => {
    if (!tokenVal) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${tokenVal}` }
      });
      if (res.data && res.data.success) {
        setUser(res.data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // Login handler
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data && res.data.success) {
      const data = res.data.data;
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await fetchUser(data.token);
      return data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (username, email, password) => {
    const res = await axios.post('/api/auth/register', { username, email, password });
    if (res.data && res.data.success) {
      const data = res.data.data;
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await fetchUser(data.token);
      return data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setLoading(false);
  };

  const refreshStats = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshStats,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
