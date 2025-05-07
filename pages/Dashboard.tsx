// Dashboard.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Dashboard = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard. This is the main overview page for Pantopia.</p>
    </div>
  );
};

// Clients.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Clients = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <p>Manage your client relationships and contacts here.</p>
    </div>
  );
};

// Opportunities.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Opportunities = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Opportunities</h1>
      <p>Track and manage your business opportunities.</p>
    </div>
  );
};

// Projects.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Projects = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <p>Monitor and manage all your ongoing and upcoming projects.</p>
    </div>
  );
};

// Tasks.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Tasks = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <p>Track your to-do items and task assignments.</p>
    </div>
  );
};

// Meetings.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Meetings = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>
      <p>Schedule and manage your upcoming meetings and events.</p>
    </div>
  );
};

// Settings.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Settings = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Configure your account preferences and application settings.</p>
    </div>
  );
};

// SignOut.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const SignOut = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, you would implement actual sign-out logic here
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Signing Out</h1>
      <p>You are being signed out. Redirecting to dashboard in 3 seconds...</p>
    </div>
  );
};

// Help.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Help = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <p>Find documentation and support resources for using Pantopia effectively.</p>
    </div>
  );
};