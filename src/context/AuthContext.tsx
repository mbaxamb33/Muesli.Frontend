// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  login: (tokens: { accessToken: string, idToken: string, refreshToken: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  idToken: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial loading from localStorage
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load tokens from localStorage only once on component mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedIdToken = localStorage.getItem('idToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    setAccessToken(storedAccessToken);
    setIdToken(storedIdToken);
    setRefreshToken(storedRefreshToken);
    setIsAuthenticated(!!storedAccessToken);
    setIsInitialized(true);
  }, []);

  const login = (tokens: { accessToken: string, idToken: string, refreshToken: string }) => {
    // Store tokens in localStorage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('idToken', tokens.idToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    // Update state
    setAccessToken(tokens.accessToken);
    setIdToken(tokens.idToken);
    setRefreshToken(tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    // Update state
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    window.location.href = 'http://localhost:8080/login';
  };

  // Don't render children until we've initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        accessToken, 
        idToken, 
        refreshToken, 
        login, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};