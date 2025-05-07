import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./layouts/AppLayout";
import {
  Dashboard,
  Clients,
} from "./pages";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            {/* <Route path="opportunities" element={<Opportunities />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="settings" element={<Settings />} />
            <Route path="signout" element={<SignOut />} />
            <Route path="help" element={<Help />} /> */}
            {/* Redirect to Dashboard for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};