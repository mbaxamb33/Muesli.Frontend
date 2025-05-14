import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DataSource } from "../components/DataSourcesTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { ArrowLeftIcon, GlobeIcon, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { Company } from "./Clients";
import { ModulesSection, Module } from "../components/ModuleSection";
import { companyAPI, datasourceAPI, paragraphAPI } from "../services/api";

export const DataSourceDetails = (): JSX.Element => {
  const { companyId, dataSourceId } = useParams<{ companyId: string; dataSourceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingDatasource, setProcessingDatasource] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!companyId || !dataSourceId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch company details
        const companyData = await companyAPI.getCompanyById(companyId);
        setCompany(companyData);
        
        // Fetch datasource details
        const companySources = await datasourceAPI.getCompanyDatasources(companyId);
        const source = companySources.find(ds => ds.id === dataSourceId);
        
        if (source) {
          setDataSource(source);
          
          // Fetch paragraphs for this datasource
          const paragraphs = await paragraphAPI.getDataSourceParagraphs(dataSourceId);
          setModules(paragraphs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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

  const handleEdit = () => {
    if (dataSource) {
      setEditDataSource(dataSource);
    }
  };

  const confirmDelete = async () => {
    if (!companyId || !dataSourceId) return;
    
    try {
      setIsLoading(true);
      // Delete datasource from the backend
      await datasourceAPI.deleteCompanyDatasource(companyId, dataSourceId);
      
      // Navigate back to the company page
      navigate(`/clients/${companyId}`);
    } catch (error) {
      console.error("Error deleting data source:", error);
      setError("Failed to delete data source. Please try again.");
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const updateDataSource = async (updatedDataSource: DataSource) => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      // Update datasource in the backend
      await datasourceAPI.updateDatasource(companyId, updatedDataSource);
      
      // Update local state
      setDataSource(updatedDataSource);
    } catch (error) {
      console.error("Error updating data source:", error);
      setError("Failed to update data source. Please try again.");
    } finally {
      setEditDataSource(null);
      setIsLoading(false);
    }
  };

  const deleteDataSource = (dataSource: DataSource) => {
    setEditDataSource(null);
    setShowDeleteModal(true);
  };

  // Module/Paragraph handlers
  const updateModule = async (updatedModule: Module) => {
    try {
      setIsLoading(true);
      // Update paragraph in the backend
      await paragraphAPI.updateParagraph(updatedModule);
      
      // Update local state
      setModules(modules.map(module => 
        module.id === updatedModule.id ? updatedModule : module
      ));
    } catch (error) {
      console.error("Error updating paragraph:", error);
      setError("Failed to update paragraph. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      setIsLoading(true);
      // Delete paragraph from the backend
      await paragraphAPI.deleteParagraph(moduleId);
      
      // Update local state
      setModules(modules.filter(module => module.id !== moduleId));
    } catch (error) {
      console.error("Error deleting paragraph:", error);
      setError("Failed to delete paragraph. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process the datasource to extract paragraphs
  const processDatasource = async () => {
    if (!dataSourceId) return;
    
    try {
      setProcessingDatasource(true);
      // Process datasource to extract paragraphs
      await datasourceAPI.processDatasource(dataSourceId);
      
      // Update the status to indicate processing
      if (dataSource) {
        setDataSource({
          ...dataSource,
          status: 'In queue'
        });
      }
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error("Error processing datasource:", error);
      setError("Failed to process datasource. Please try again.");
    } finally {
      setProcessingDatasource(false);
    }
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

  // Loading state
  if (isLoading && !dataSource) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading datasource details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dataSource && !company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
            {error}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className={`${
              isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!dataSource && !isLoading) {
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
            Back to {company?.name || 'Company'}
          </Button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {dataSource?.name || 'Data Source Details'}
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className={`rounded-lg border-l-4 p-4 mb-6 ${
            isDark 
            ? "bg-red-900/30 border-red-500 text-red-300" 
            : "bg-red-50 border-red-500 text-red-700"
          }`}>
            <p>{error}</p>
          </div>
        )}

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
                  {dataSource && getTypeIcon(dataSource.type)}
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {dataSource?.name || 'Unnamed Data Source'}
                  </h2>
                  <div className="flex items-center mt-1">
                    {dataSource && (
                      <>
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
                      </>
                      )}
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
                    {company?.name || 'Unknown Company'}
                  </p>
                </div>

                <div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dataSource?.type === 'website' ? 'URL' : 'Filename'}
                  </h3>
                  {dataSource?.type === 'website' && dataSource.link ? (
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
                      {dataSource?.filename || "N/A"}
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
                        dataSource?.status === 'Processed' 
                          ? isDark ? 'bg-green-500' : 'bg-green-600'
                          : dataSource?.status === 'Extracting'
                            ? isDark ? 'bg-yellow-500' : 'bg-yellow-600'
                            : dataSource?.status === 'In queue'
                              ? isDark ? 'bg-blue-500' : 'bg-blue-600'
                              : isDark ? 'bg-gray-700' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: dataSource?.status === 'Processed' 
                          ? '100%' 
                          : dataSource?.status === 'Extracting'
                            ? '60%'
                            : dataSource?.status === 'In queue'
                              ? '30%'
                              : '0%'
                      }}
                    ></div>
                  </div>
                  <p className={`mt-1 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dataSource?.status === 'Processed' 
                      ? 'This data source has been fully processed and is ready for use.'
                      : dataSource?.status === 'Extracting'
                        ? 'Currently extracting information from this data source.'
                        : dataSource?.status === 'In queue'
                          ? 'This data source is waiting to be processed.'
                          : 'This data source has not started processing yet.'}
                  </p>
                </div>

                {dataSource?.status === 'Processed' && (
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Processed Date
                    </h4>
                    <p className={`${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      May 14, 2025
                    </p>
                  </div>
                )}

                {/* Process button for datasources that need processing */}
                {dataSource?.status === 'Not extracted' && (
                  <Button
                    onClick={processDatasource}
                    className={`mt-4 ${
                      isDark 
                      ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                    }`}
                    disabled={processingDatasource}
                  >
                    {processingDatasource ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Process Datasource"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modules/Paragraphs Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Paragraphs
            </h2>
          </div>
          
          {isLoading && modules.length === 0 ? (
            <div className={`flex justify-center items-center p-8 rounded-lg border ${
              isDark ? "border-[#2e2c50] bg-[#17162e] text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading paragraphs...
            </div>
          ) : modules.length === 0 ? (
            <div className={`p-8 rounded-lg border text-center ${
              isDark ? "border-[#2e2c50] bg-[#17162e] text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}>
              {dataSource?.status === 'Not extracted' ? (
                <div>
                  <p className="mb-4">This datasource hasn't been processed yet. Process it to extract paragraphs.</p>
                  <Button
                    onClick={processDatasource}
                    className={`${
                      isDark 
                      ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                    }`}
                    disabled={processingDatasource}
                  >
                    {processingDatasource ? "Processing..." : "Process Datasource"}
                  </Button>
                </div>
              ) : dataSource?.status === 'In queue' || dataSource?.status === 'Extracting' ? (
                <p>Datasource is currently being processed. Paragraphs will appear here when processing is complete.</p>
              ) : (
                <p>No paragraphs found for this datasource.</p>
              )}
            </div>
          ) : (
            <ModulesSection 
              modules={modules}
              isDark={isDark}
              onUpdateModule={updateModule}
              onDeleteModule={deleteModule}
            />
          )}
        </div>

        {/* Edit Data Source Sheet */}
        <EditDataSourceSheet
          dataSource={editDataSource}
          onUpdate={updateDataSource}
          onDelete={deleteDataSource}
          onClose={() => setEditDataSource(null)}
          open={editDataSource !== null}
          isDark={isDark}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmationModal
            itemName={dataSource?.name || 'this datasource'}
            itemType="Data Source"
            onDelete={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};