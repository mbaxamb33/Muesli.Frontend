// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If not authenticated, redirect to backend login endpoint immediately
    if (!isAuthenticated) {
      // Redirect to your backend login endpoint (which triggers Cognito)
      window.location.href = '/login';
    }
  }, [isAuthenticated]);
  
  // If not authenticated, show a loading state while redirecting
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
  
  // If authenticated, render the children components
  return <>{children}</>;
};