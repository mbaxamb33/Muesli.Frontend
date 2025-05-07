import React from "react";
import { useTheme } from "../context/ThemeContext";

export const Meetings = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300`}>
      {/* Empty content as per existing pattern */}
    </div>
  );
};