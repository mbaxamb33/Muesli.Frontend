import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbItem } from "../types/breadcrumb";

interface PageTemplateProps {
  title: string;
  breadcrumbItems?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({ 
  title, 
  breadcrumbItems,
  children 
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Page Title */}
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
          {title}
        </h1>
        
        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};