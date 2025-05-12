import React from "react";
import { ExternalLinkIcon } from "lucide-react";
import { Company } from "../pages/Clients";

interface ClientsTableProps {
  companies: Company[];
  isDark: boolean;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ companies, isDark }) => {
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
              Website
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Notes
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
              <tr key={company.id}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {company.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {company.industry}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  <a 
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center ${
                      isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {company.website}
                    <ExternalLinkIcon className="ml-1 w-3 h-3" />
                  </a>
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {company.address}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {company.notes}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};