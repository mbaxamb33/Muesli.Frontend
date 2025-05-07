import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export const Layout = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex flex-row justify-center w-full min-h-screen transition-colors duration-300`}>
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} w-full min-h-screen transition-colors duration-300`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};