import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Opportunities = (): JSX.Element => {
  // Get breadcrumb items for the opportunities page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/opportunities");
  }, []);
  
  return (
    <PageTemplate 
      title="Opportunities" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Opportunities content will go here */}
    </PageTemplate>
  );
};