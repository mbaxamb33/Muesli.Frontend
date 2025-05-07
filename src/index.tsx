import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/Layout/Layout";
import { 
  Dashboard,
  Clients,
  Opportunities,
  Projects,
  Tasks,
  Meetings,
  Settings,
  SignOut,
  Help 
} from "./pages";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="settings" element={<Settings />} />
            <Route path="signout" element={<SignOut />} />
            <Route path="help" element={<Help />} />
            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);