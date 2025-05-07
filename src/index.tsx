import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Desktop } from "./screens/Desktop";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <Desktop />
    </ThemeProvider>
  </StrictMode>
);