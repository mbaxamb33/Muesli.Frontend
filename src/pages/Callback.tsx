// src/pages/Callback.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Callback = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Parse the query parameters
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const refreshToken = params.get('refresh_token');
    const returnUrl = params.get('return_url') || '/';
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
      
      // Redirect to the return URL or dashboard
      navigate(returnUrl, { replace: true });
    } else {
      setError('Authentication failed. Missing tokens in response.');
    }
  }, [login, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      {error ? (
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = 'http://localhost:8080/login'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl mb-4">Completing login...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      )}
    </div>
  );
};