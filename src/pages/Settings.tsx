import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Settings = (): JSX.Element => {
  // Get breadcrumb items for the settings page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/settings");
  }, []);
  
  return (
    <PageTemplate 
      title="Settings" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Settings content will go here */}
    </PageTemplate>
  );
};