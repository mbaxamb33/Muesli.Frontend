// src/App.tsx (updated)
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./layouts/AppLayout";
import {
  Dashboard,
  Clients,
  Opportunities,
  Projects,
  Tasks,
  Meetings,
  Settings,
  Help
} from "./pages";
import { CompanyDetails } from "./pages/CompanyDetails";
import { ProjectDetails } from "./pages/ProjectDetails";
import { DataSourceDetails } from "./pages/DataSourceDetails";
import { ContactDetails } from "./pages/ContactDetails";
import { ContactDataSourceDetails } from "./pages/ContactDatasourceDetails";
import { ProjectDataSourceDetails } from "./pages/ProjectDatasourceDetails";

// Main application component
// This component sets up the routing for the application
// and wraps the application in a theme provider for consistent styling
// It uses React Router for navigation and defines the main layout
// for the application

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:companyId" element={<CompanyDetails />} />
          <Route path="clients/:companyId/datasources/:dataSourceId" element={<DataSourceDetails />} />
          <Route path="contacts/:contactId" element={<ContactDetails />} />
          <Route path="contacts/:contactId/datasources/:dataSourceId" element={<ContactDataSourceDetails />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="projects/:projectId/datasources/:dataSourceId" element={<ProjectDataSourceDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          {/* Redirect to Dashboard for any unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};