import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLinkIcon, EditIcon, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon, GlobeIcon } from "lucide-react";
import { Button } from "./components/button";

// Define the DataSource type
export interface DataSource {
  id: string;
  name: string;
  type: "website" | "audio" | "word" | "pdf" | "excel" | "txt";
  status: "Not extracted" | "In queue" | "Extracting" | "Processed";
  link?: string;
  filename?: string;
}

interface DataSourcesTableProps {
  dataSources: DataSource[];
  isDark: boolean;
  onEditClick: (dataSource: DataSource) => void;
  sourceType?: 'company' | 'contact' | 'project'; // Add project type
}

export const DataSourcesTable: React.FC<DataSourcesTableProps> = ({ 
  dataSources, 
  isDark, 
  onEditClick,
  sourceType = 'company' // Default to company context
}) => {
  const navigate = useNavigate();
  const { companyId, contactId, projectId } = useParams<{ companyId: string; contactId: string; projectId: string }>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return isDark ? 'text-green-400' : 'text-green-600';
      case 'Not extracted': return isDark ? 'text-gray-400' : 'text-gray-600';
      case 'In queue': return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'Extracting': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDark ? 'text-gray-300' : 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    // Get background colors based on status
    let bgColor = '';
    
    switch (status) {
      case 'Processed': 
        bgColor = isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
        break;
      case 'Not extracted': 
        bgColor = isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
        break;
      case 'In queue': 
        bgColor = isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
        break;
      case 'Extracting': 
        bgColor = isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
        break;
      default: 
        bgColor = isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <GlobeIcon className="w-4 h-4" />;
      case 'audio': return <FileAudioIcon className="w-4 h-4" />;
      case 'word': return <FileTextIcon className="w-4 h-4" />;
      case 'pdf': return <FileTextIcon className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheetIcon className="w-4 h-4" />;
      case 'txt': return <FileIcon className="w-4 h-4" />;
      default: return <FileIcon className="w-4 h-4" />;
    }
  };

  const handleRowClick = (dataSourceId: string) => {
    if (sourceType === 'company' && companyId) {
      navigate(`/clients/${companyId}/datasources/${dataSourceId}`);
    } else if (sourceType === 'contact' && contactId) {
      navigate(`/contacts/${contactId}/datasources/${dataSourceId}`);
    } else if (sourceType === 'project' && projectId) {
      navigate(`/projects/${projectId}/datasources/${dataSourceId}`);
    }
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
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Source
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`${
          isDark ? "bg-[#17162e] divide-[#2e2c50]" : "bg-white divide-gray-200"
        } divide-y`}>
          {dataSources.length === 0 ? (
            <tr>
              <td 
                colSpan={5} 
                className={`px-6 py-4 text-center text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No data sources found. Add your first data source with the button above.
              </td>
            </tr>
          ) : (
            dataSources.map((dataSource) => (
              <tr 
                key={dataSource.id} 
                className={`cursor-pointer ${isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"}`}
                onClick={() => handleRowClick(dataSource.id)}
              >
                <td 
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {dataSource.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } flex items-center`}>
                  <span className="mr-2">{getTypeIcon(dataSource.type)}</span>
                  {dataSource.type.charAt(0).toUpperCase() + dataSource.type.slice(1)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                  {getStatusBadge(dataSource.status)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {dataSource.type === 'website' && dataSource.link ? (
                    <a 
                      href={dataSource.link.startsWith('http') ? dataSource.link : `https://${dataSource.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center ${
                        isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {dataSource.link}
                      <ExternalLinkIcon className="ml-1 w-3 h-3" />
                    </a>
                  ) : (
                    dataSource.filename || "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(dataSource);
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