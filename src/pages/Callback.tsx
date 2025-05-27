// src/pages/Callback.tsx - Fixed version
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export const Callback = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
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
        
        if (!accessToken || !idToken || !refreshToken) {
          setError('Authentication failed. Missing tokens in response.');
          return;
        }

        // Save tokens first
        login({
          accessToken,
          idToken,
          refreshToken
        });

        // Try to create user record in database
        try {
          const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          
          // Try to get existing user first
          try {
            const existingUser = await apiClient.get('/api/v1/users/me');
            console.log('User already exists:', existingUser.data);
          } catch (userCheckError: any) {
            if (userCheckError.response?.status === 404) {
              // User doesn't exist, create them with backend's expected structure
              console.log('Creating new user in database...');
              const firstName = tokenPayload.given_name || 'User';
              const lastName = tokenPayload.family_name || 'Name';
              const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '');
              
              const userInfo = {
                cognito_sub: tokenPayload.sub,
                username: username,
                password: 'cognito_managed' // Placeholder since Cognito handles auth
              };
              
              const newUser = await apiClient.post('/api/v1/users/', userInfo);
              console.log('User created successfully:', newUser.data);
            } else {
              console.error('Error checking user:', userCheckError);
            }
          }
        } catch (userError) {
          console.error('Error handling user creation:', userError);
          // Don't block login for user creation issues
        }
        
        console.log('Redirecting to:', returnUrl);
        // Redirect to the return URL or dashboard
        navigate(returnUrl, { replace: true });
        
      } catch (err) {
        console.error('Callback handling error:', err);
        setError('Authentication processing failed.');
      }
    };

    handleCallback();
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