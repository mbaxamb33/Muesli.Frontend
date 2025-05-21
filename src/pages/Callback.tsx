// src/pages/Callback.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Callback = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Parse the query parameters
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const refreshToken = params.get('refresh_token');
    const errorMsg = params.get('error');
    
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
    if (accessToken && idToken && refreshToken) {
      // Save tokens and set authenticated state
      login({
        accessToken,
        idToken,
        refreshToken
      });
      
      // Redirect to dashboard
      navigate('/');
    } else {
      setError('Authentication failed. Missing tokens in response.');
    }
  }, [location, login, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      {error ? (
        <div className="text-red-500">
          <h1>Authentication Error</h1>
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl mb-4">Logging you in...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      )}
    </div>
  );
};