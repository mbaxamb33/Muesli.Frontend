import { BreadcrumbItem } from "../types/breadcrumb";

// Map of route paths to their corresponding display names
const routeNameMap: Record<string, string> = {
  "/": "Home",
  "/clients": "Clients",
  "/opportunities": "Opportunities",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/meetings": "Meetings",
  "/settings": "Settings",
  "/help": "Help"
};

// Map of entity types to their data fetching functions
// This would be replaced with actual API calls in a real application
export interface EntityData {
  id: string;
  displayName: string;
  [key: string]: any;
}

// Example entity resolver for dynamic routes
const entityResolvers: Record<string, (id: string) => Promise<EntityData | null>> = {
  "clients": async (id: string) => {
    // Simulate API call to get company data
    // In a real app, this would fetch from your API
    const companies = [
      { id: "1", displayName: "Tech Innovations Inc" },
      { id: "2", displayName: "Green Energy Solutions" },
      { id: "3", displayName: "Global Finance Group" },
      { id: "4", displayName: "Healthcare Innovations" },
      { id: "5", displayName: "Retail Revolution" }
    ];
    
    const company = companies.find(c => c.id === id);
    return company ? company : null;
  },
  "projects": async (id: string) => {
    // Simulate API call for projects
    const projects = [
      { id: "p1", displayName: "Website Redesign" },
      { id: "p2", displayName: "Mobile App Development" }
    ];
    
    const project = projects.find(p => p.id === id);
    return project ? project : null;
  }
  // Add more entity resolvers as needed
};

/**
 * Generate breadcrumb items based on a path
 * @param path The current path (e.g., /clients/123)
 * @param customLabels Optional map of custom labels for specific path segments
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbsFromPath = (
  path: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];
  
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // If we have a custom label for this exact path, use it
    if (customLabels && customLabels[currentPath]) {
      breadcrumbs.push({
        label: customLabels[currentPath],
        path: currentPath
      });
    } else {
      // Check if we have a predefined name for this path
      const label = routeNameMap[currentPath] || 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    }
  });
  
  return breadcrumbs;
};

/**
 * Asynchronously resolve entity names for dynamic routes
 * @param path The current path (e.g., /clients/123)
 * @returns Promise with breadcrumb items including resolved entity names
 */
export const resolveDynamicBreadcrumbs = async (
  path: string
): Promise<BreadcrumbItem[]> => {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];
  
  let currentPath = "";
  let parentEntityType: string | null = null;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // If this is a known route, use its predefined name
    if (routeNameMap[currentPath]) {
      breadcrumbs.push({
        label: routeNameMap[currentPath],
        path: currentPath
      });
      
      // Remember this as a potential parent entity type
      parentEntityType = segment;
    } 
    // Check if this could be a dynamic segment (ID) and we have a parent entity type
    else if (parentEntityType && entityResolvers[parentEntityType]) {
      try {
        // Try to resolve the entity name
        const entityData = await entityResolvers[parentEntityType](segment);
        
        if (entityData) {
          breadcrumbs.push({
            label: entityData.displayName,
            path: currentPath
          });
        } else {
          // Fallback if we can't resolve the entity
          breadcrumbs.push({
            label: segment,
            path: currentPath
          });
        }
      } catch (error) {
        console.error("Error resolving entity name:", error);
        // Fallback to using the segment as is
        breadcrumbs.push({
          label: segment,
          path: currentPath
        });
      }
      
      // Reset parent entity type as we've processed this ID
      parentEntityType = null;
    } 
    // Otherwise, just use the segment name with basic formatting
    else {
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        path: currentPath
      });
    }
  }
  
  return breadcrumbs;
};