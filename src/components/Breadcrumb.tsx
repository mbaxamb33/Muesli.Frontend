import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Loader } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./components/button";
import { BreadcrumbItem } from "../types/breadcrumb";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  isLoading?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items = [], 
  isLoading = false 
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  // Generate breadcrumb items based on current path if not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items && items.length > 0) return items;
    
    // Use the utility function to generate breadcrumbs from the current path
    return getBreadcrumbsFromPath(location.pathname);
  }, [location.pathname, items]);

  return (
    <nav className="flex items-center py-4" aria-label="Breadcrumb">
      {isLoading ? (
        <div className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          <span>Loading breadcrumbs...</span>
        </div>
      ) : (
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    className={`mx-1 h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} 
                  />
                )}
                
                {isLast ? (
                  <span 
                    className={`${
                      isDark ? "text-gray-200" : "text-gray-700"
                    } font-medium`}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 ${
                        isDark 
                          ? "text-gray-300 hover:bg-[#201e3d]" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
};