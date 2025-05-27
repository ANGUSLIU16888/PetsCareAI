import React, { createContext, useState, useContext } from 'react';
import * as authService from '../lib/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    const result = await authService.login(username, password);
    if (result.success) {
      setCurrentUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
