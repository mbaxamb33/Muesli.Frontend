import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Company } from "./Clients";
import { Breadcrumb } from "../components/Breadcrumb";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";

// Sample companies (in a real app, this would come from an API or global state)
const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Innovations Inc",
    industry: "Technology",
    website: "techinnovations.com",
    address: "123 Tech Avenue, Silicon Valley, CA",
    notes: "Leading AI solutions provider",
    status: "Active",
  },
  {
    id: "2",
    name: "Green Energy Solutions",
    industry: "Energy",
    website: "greenenergysolutions.com",
    address: "456 Renewable Road, Portland, OR",
    notes: "Focused on sustainable energy solutions",
    status: "Potential",
  },
  {
    id: "3",
    name: "Global Finance Group",
    industry: "Finance",
    website: "globalfinance.com",
    address: "789 Wall Street, New York, NY",
    notes: "International investment banking",
    status: "Active",
  },
];

export const CompanyDetails = (): JSX.Element => {
  const { companyId } = useParams<{ companyId: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [company, setCompany] = useState<Company | null>(null);

  // Create breadcrumbs directly with the company name when available
  const breadcrumbItems = React.useMemo(() => {
    // Use a simplified approach to create breadcrumbs
    const baseBreadcrumbs = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    // Add the company name as the last breadcrumb if it's available
    if (company) {
      baseBreadcrumbs.push({
        label: company.name,
        path: `/clients/${companyId}`
      });
    }
    
    return baseBreadcrumbs;
  }, [companyId, company]);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCompany = initialCompanies.find(c => c.id === companyId);
    setCompany(foundCompany || null);
  }, [companyId]);

  if (!company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Company not found
        </p>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Simplified breadcrumb implementation that doesn't rely on async resolution */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Company Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {company.name}
          </h1>
          <div className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {company.industry} | {company.status}
          </div>
        </div>

        {/* Company Details Card */}
        <div className={`rounded-lg shadow-md p-6 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Company Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Website</span>
                  <a 
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {company.website}
                  </a>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Address</span>
                  <p>{company.address}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Additional Notes
              </h2>
              <p className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {company.notes || 'No additional notes'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};