// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If not authenticated, redirect directly to backend login
    if (!isAuthenticated) {
      // Get the current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const encodedReturnUrl = encodeURIComponent(currentPath);
      
      // Redirect to backend login with return URL
      window.location.href = `http://localhost:8080/login?returnUrl=${encodedReturnUrl}`;
    }
  }, [isAuthenticated]);
  
  // While redirecting, show loading
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Redirecting to login...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // If authenticated, render children
  return <>{children}</>;
};