// src/context/AuthContext.jsx
import { useNavigate } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isLoggedIn());

  useEffect(() => {
    apiService.initAuth();
  }, []);

  const login = async (username, password) => {
    await apiService.login(username, password);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const signup = async (username, email, password) => {
    await apiService.signup(username, email, password);
    setIsLoggedIn(true); // Automatically log in user after signup
    navigate('/dashboard');
  };

  const logout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
