import React from "react";
import { ExternalLinkIcon, EditIcon } from "lucide-react";
import { Company } from "../pages/Clients";
import { Button } from "./components/button";

interface ClientsTableProps {
  companies: Company[];
  isDark: boolean;
  onEditClick: (company: Company) => void;
  onRowClick: (companyId: string) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ 
  companies, 
  isDark, 
  onEditClick,
  onRowClick 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return isDark ? 'text-green-400' : 'text-green-600';
      case 'Inactive': return isDark ? 'text-red-400' : 'text-red-600';
      case 'Potential': return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'Onboarding': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'Suspended': return isDark ? 'text-gray-400' : 'text-gray-600';
      default: return isDark ? 'text-gray-300' : 'text-gray-500';
    }
  };

  // Format website URLs properly for display and links
  const formatWebsite = (website: string): string => {
    if (!website) return '';
    
    // Remove any http:// or https:// prefixes for display
    return website.replace(/^https?:\/\//, '');
  };

  // Get proper URL with protocol for href attribute
  const getWebsiteUrl = (website: string): string => {
    if (!website) return '#';
    
    // Add https:// if no protocol specified
    return website.startsWith('http') ? website : `https://${website}`;
  };

  return (
    <div className={`overflow-hidden rounded-lg border ${
      isDark ? "border-[#2e2c50]" : "border-gray-200"
    }`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={`${
          isDark ? "bg-[#201e3d] text-gray-300" : "bg-gray-50 text-gray-600"
        }`}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Industry
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Website
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`${
          isDark ? "bg-[#17162e] divide-[#2e2c50]" : "bg-white divide-gray-200"
        } divide-y`}>
          {companies.length === 0 ? (
            <tr>
              <td 
                colSpan={5} 
                className={`px-6 py-4 text-center text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No companies found. Add your first company with the button above.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr 
                key={company.id} 
                className={`cursor-pointer ${
                  isDark 
                    ? "hover:bg-[#201e3d]" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onRowClick(company.id)}
              >
                <td 
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {company.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {company.industry}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  getStatusColor(company.status)
                }`}>
                  {company.status}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {company.website ? (
                    <a 
                      href={getWebsiteUrl(company.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center ${
                        isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {formatWebsite(company.website)}
                      <ExternalLinkIcon className="ml-1 w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(company);
                    }}
                    className={`${
                      isDark 
                      ? "text-blue-400 hover:bg-[#201e3d] hover:text-blue-300" 
                      : "text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                    }`}
                  >
                    <EditIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};