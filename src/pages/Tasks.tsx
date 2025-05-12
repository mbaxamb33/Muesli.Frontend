import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Tasks = (): JSX.Element => {
  // Get breadcrumb items for the tasks page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/tasks");
  }, []);
  
  return (
    <PageTemplate 
      title="Tasks" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Tasks content will go here */}
    </PageTemplate>
  );
};