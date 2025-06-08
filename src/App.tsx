// src/App.tsx (updated)
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Callback } from "./pages/Callback";
// Import all your pages
import {
  Dashboard,
  Clients,
  Opportunities,
  Projects,
  Tasks,
  Meetings,
  Settings,
  Help,
  Briefs,
  BriefDetails,
  CompanyDetails,
  ProjectDetails,
  DataSourceDetails,
  ContactDetails,
  ContactDataSourceDetails,
  ProjectDataSourceDetails
} from "./pages";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Callback route to handle post-authentication redirect */}
            <Route path="/callback" element={<Callback />} />
            
            {/* All application routes are protected */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:companyId" element={<CompanyDetails />} />
              <Route path="clients/:companyId/datasources/:dataSourceId" element={<DataSourceDetails />} />
              <Route path="contacts/:contactId" element={<ContactDetails />} />
              <Route path="contacts/:contactId/datasources/:dataSourceId" element={<ContactDataSourceDetails />} />
              <Route path="/briefs" element={<Briefs />} />
              <Route path="/briefs/:briefId" element={<BriefDetails />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
};