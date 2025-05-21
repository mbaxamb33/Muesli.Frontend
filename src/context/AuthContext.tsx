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
  const [accessToken, setAccessToken] = useState<string | null>(() => 
    localStorage.getItem("accessToken"));
  const [idToken, setIdToken] = useState<string | null>(() => 
    localStorage.getItem("idToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => 
    localStorage.getItem("refreshToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!accessToken);

  useEffect(() => {
    // Check if we have a token on component mount
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, [accessToken]);

  const login = (tokens: { accessToken: string, idToken: string, refreshToken: string }) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("idToken", tokens.idToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    
    setAccessToken(tokens.accessToken);
    setIdToken(tokens.idToken);
    setRefreshToken(tokens.refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

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