// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isLoggedIn());

  useEffect(() => {
    // Optionally, you can init auth here if needed
    apiService.initAuth();
  }, []);

  const login = async (username, password) => {
    await apiService.login(username, password);
    setIsLoggedIn(true);
  };

  const signup = async (username, email, password) => {
    await apiService.signup(username, email, password);
    setIsLoggedIn(true); // Automatically log in user after signup
  };

  const logout = () => {
    apiService.logout();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
