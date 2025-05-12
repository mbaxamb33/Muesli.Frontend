import React from "react";
import { PageTemplate } from "../components/PageTemplate";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

export const Meetings = (): JSX.Element => {
  // Get breadcrumb items for the meetings page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/meetings");
  }, []);
  
  return (
    <PageTemplate 
      title="Meetings" 
      breadcrumbItems={breadcrumbItems}
    >
      {/* Meetings content will go here */}
    </PageTemplate>
  );
};