import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DataSource } from "../components/DataSourcesTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { EditIcon, TrashIcon, ArrowLeftIcon, GlobeIcon, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { Company } from "./Clients";

// Sample data sources (in a real app, this would come from an API or global state)
const initialDataSources: Record<string, DataSource[]> = {
  "1": [
    {
      id: "ds1",
      name: "Company Website",
      type: "website",
      status: "Processed",
      link: "techinnovations.com"
    },
    {
      id: "ds2",
      name: "Annual Report 2024",
      type: "pdf",
      status: "In queue",
      filename: "annual_report_2024.pdf"
    }
  ],
  "2": [
    {
      id: "ds3",
      name: "Green Energy Blog",
      type: "website",
      status: "Not extracted",
      link: "blog.greenenergysolutions.com"
    }
  ],
  "3": [
    {
      id: "ds4",
      name: "Financial Report Q1",
      type: "excel",
      status: "Extracting",
      filename: "financial_report_q1.xlsx"
    }
  ]
};

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
  }
];

export const DataSourceDetails = (): JSX.Element => {
  const { companyId, dataSourceId } = useParams<{ companyId: string; dataSourceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  // Removed state variables for edit and delete functionality

  useEffect(() => {
    // Fetch company data
    if (companyId) {
      const foundCompany = initialCompanies.find(c => c.id === companyId);
      setCompany(foundCompany || null);
    }
    
    // Fetch data source
    if (companyId && dataSourceId) {
      const companySources = initialDataSources[companyId] || [];
      const foundDataSource = companySources.find(ds => ds.id === dataSourceId);
      setDataSource(foundDataSource || null);
    }
  }, [companyId, dataSourceId]);

  // Generate breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    if (company) {
      items.push({
        label: company.name,
        path: `/clients/${companyId}`
      });
    }
    
    if (dataSource) {
      items.push({
        label: dataSource.name,
        path: `/clients/${companyId}/datasources/${dataSourceId}`
      });
    }
    
    return items;
  }, [company, dataSource, companyId, dataSourceId]);

  // Removed handleEdit and handleDelete functions

  const confirmDelete = () => {
    // In a real app, this would make an API call to delete the data source
    // For now, just navigate back to the company page
    setShowDeleteModal(false);
    navigate(`/clients/${companyId}`);
  };

  const updateDataSource = (updatedDataSource: DataSource) => {
    // In a real app, this would make an API call to update the data source
    setDataSource(updatedDataSource);
    setEditDataSource(null);
  };

  const deleteDataSource = (dataSource: DataSource) => {
    setEditDataSource(null);
    setShowDeleteModal(true);
  };

  // Get icon based on data source type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <GlobeIcon className="w-5 h-5" />;
      case 'audio': return <FileAudioIcon className="w-5 h-5" />;
      case 'word': return <FileTextIcon className="w-5 h-5" />;
      case 'pdf': return <FileTextIcon className="w-5 h-5" />;
      case 'excel': return <FileSpreadsheetIcon className="w-5 h-5" />;
      case 'txt': return <FileIcon className="w-5 h-5" />;
      default: return <FileIcon className="w-5 h-5" />;
    }
  };

  // Get status color based on data source status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'Not extracted': return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
      case 'In queue': return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'Extracting': return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      default: return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
  };

  if (!dataSource || !company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Data source not found
        </p>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Back button and page title */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/clients/${companyId}`)}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to {company.name}
          </Button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {dataSource.name}
          </h1>
        </div>

        {/* Data Source Details Card */}
        <div className={`rounded-lg shadow-md p-6 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full mr-3 ${
                  isDark ? 'bg-[#201e3d]' : 'bg-gray-100'
                }`}>
                  {getTypeIcon(dataSource.type)}
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {dataSource.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(dataSource.status)
                    }`}>
                      {dataSource.status}
                    </span>
                    <span className={`ml-2 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {dataSource.type.charAt(0).toUpperCase() + dataSource.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Company
                  </h3>
                  <p className={`${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {company.name}
                  </p>
                </div>

                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dataSource.type === 'website' ? 'URL' : 'Filename'}
                  </h3>
                  {dataSource.type === 'website' && dataSource.link ? (
                    <a 
                      href={dataSource.link.startsWith('http') ? dataSource.link : `https://${dataSource.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {dataSource.link}
                    </a>
                  ) : (
                    <p className={`${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      {dataSource.filename || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Processing Information */}
            <div className={`p-5 rounded-lg ${
              isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-medium mb-3 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Processing Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Status
                  </h4>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-[#2e2c50]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        dataSource.status === 'Processed' 
                          ? isDark ? 'bg-green-500' : 'bg-green-600'
                          : dataSource.status === 'Extracting'
                            ? isDark ? 'bg-yellow-500' : 'bg-yellow-600'
                            : dataSource.status === 'In queue'
                              ? isDark ? 'bg-blue-500' : 'bg-blue-600'
                              : isDark ? 'bg-gray-700' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: dataSource.status === 'Processed' 
                          ? '100%' 
                          : dataSource.status === 'Extracting'
                            ? '60%'
                            : dataSource.status === 'In queue'
                              ? '30%'
                              : '0%'
                      }}
                    ></div>
                  </div>
                  <p className={`mt-1 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dataSource.status === 'Processed' 
                      ? 'This data source has been fully processed and is ready for use.'
                      : dataSource.status === 'Extracting'
                        ? 'Currently extracting information from this data source.'
                        : dataSource.status === 'In queue'
                          ? 'This data source is waiting to be processed.'
                          : 'This data source has not started processing yet.'}
                  </p>
                </div>

                {dataSource.status === 'Processed' && (
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Processed Date
                    </h4>
                    <p className={`${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      May 10, 2025
                    </p>
                  </div>
                )}

                {/* Action button for processed data sources */}
                {dataSource.status === 'Processed' && (
                  <Button
                    className={`mt-4 ${
                      isDark 
                      ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                    }`}
                  >
                    Process Datasource
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Removed Edit Data Source Sheet and Delete Confirmation Modal */}
    </div>
  );
};