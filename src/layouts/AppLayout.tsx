import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

export const AppLayout = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-row justify-center w-full min-h-screen">
      <div className="w-full min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};