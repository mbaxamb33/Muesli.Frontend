import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Projects = (): JSX.Element => {
  // Get breadcrumb items for the projects page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/projects");
  }, []);
  
  return (
    <PageTemplate 
      title="Projects" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Projects content will go here */}
    </PageTemplate>
  );
};