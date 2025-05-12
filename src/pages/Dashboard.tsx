import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Breadcrumb } from "../components/Breadcrumb";

export const Dashboard = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Dashboard breadcrumb is simply "Home"
  const breadcrumbItems = React.useMemo(() => {
    return [
      { label: "Home", path: "/" }
    ];
  }, []);
  
  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb for Dashboard */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Dashboard content here */}
        <div className="mt-4">
          {/* Empty content as requested */}
        </div>
      </div>
    </div>
  );
};