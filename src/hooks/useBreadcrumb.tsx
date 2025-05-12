import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BreadcrumbItem } from "../types/breadcrumb";
import { getBreadcrumbsFromPath, resolveDynamicBreadcrumbs } from "../utils/breadcrumb";

interface UseBreadcrumbsOptions {
  /**
   * Custom labels for specific path segments
   */
  customLabels?: Record<string, string>;
  
  /**
   * Whether to resolve dynamic segments (like IDs) to their display names
   * This will make an async API call if true
   */
  resolveDynamic?: boolean;
}

/**
 * Hook to get breadcrumb items for the current route
 */
export const useBreadcrumbs = (options: UseBreadcrumbsOptions = {}) => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      if (options.resolveDynamic) {
        setIsLoading(true);
        try {
          const resolvedBreadcrumbs = await resolveDynamicBreadcrumbs(location.pathname);
          setBreadcrumbs(resolvedBreadcrumbs);
        } catch (error) {
          console.error("Error resolving dynamic breadcrumbs:", error);
          // Fallback to static breadcrumbs
          const staticBreadcrumbs = getBreadcrumbsFromPath(location.pathname, options.customLabels);
          setBreadcrumbs(staticBreadcrumbs);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use static breadcrumbs
        const staticBreadcrumbs = getBreadcrumbsFromPath(location.pathname, options.customLabels);
        setBreadcrumbs(staticBreadcrumbs);
      }
    };
    
    fetchBreadcrumbs();
  }, [location.pathname, options.resolveDynamic, options.customLabels]);
  
  return { breadcrumbs, isLoading };
};