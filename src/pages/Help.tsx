import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Help = (): JSX.Element => {
  // Get breadcrumb items for the help page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/help");
  }, []);
  
  return (
    <PageTemplate 
      title="Help" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Help content will go here */}
    </PageTemplate>
  );
};