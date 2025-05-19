// src/pages/ProjectDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Project } from "./Projects";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";
import { DataSourcesTable, DataSource } from "../components/DatasourcesTable";
import { AddDataSourceCard } from "../components/AddDataSourceCard";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { projectAPI, datasourceAPI } from "../services/projectAPI";

type DeleteItem = {
  type: 'dataSource';
  id: string;
  name: string;
};

export const ProjectDetails = (): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [project, setProject] = useState<Project | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  // Fetch project data from API
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch project details
        const projectData = await projectAPI.getProjectById(projectId);
        setProject(projectData);
        
        // Fetch project datasources
        const datasources = await datasourceAPI.getProjectDatasources(projectId);
        setDataSources(datasources);
        
        // Update project source count if needed
        if (projectData.sourceCount !== datasources.length) {
          setProject({
            ...projectData,
            sourceCount: datasources.length
          });
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // Create breadcrumbs with project name when available
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Projects", path: "/projects" }
    ];
    
    if (project) {
      items.push({
        label: project.name,
        path: `/projects/${projectId}`
      });
    }
    
    return items;
  }, [projectId, project]);

  // Add datasource to project
  const addDataSource = async (dataSource: Omit<DataSource, "id">) => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      
      // Create datasource and associate with project
      const newDataSource = await datasourceAPI.createProjectDatasource(projectId, dataSource);
      
      // Update local state
      setDataSources([...dataSources, newDataSource]);
      
      // Update project source count
      if (project) {
        setProject({
          ...project,
          sourceCount: project.sourceCount + 1
        });
      }
      
      setShowAddDataSourceCard(false);
    } catch (error) {
      console.error("Failed to add datasource:", error);
      setError("Failed to add datasource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update a datasource
  const updateDataSource = async (updatedDataSource: DataSource) => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      
      // Update datasource in the backend
      await datasourceAPI.updateProjectDatasource(projectId, updatedDataSource);
      
      // Update local state
      setDataSources(dataSources.map(ds => 
        ds.id === updatedDataSource.id ? updatedDataSource : ds
      ));
      
      // Close the edit form
      setEditDataSource(null);
    } catch (error) {
      console.error("Failed to update datasource:", error);
      setError("Failed to update datasource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a datasource
  const deleteDataSource = (dataSource: DataSource) => {
    // First close the edit sheet
    setEditDataSource(null);
    
    // Show delete confirmation modal
    setDeleteItem({
      type: 'dataSource',
      id: dataSource.id,
      name: dataSource.name
    });
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = async () => {
    if (!deleteItem || !projectId) return;
    
    try {
      setIsLoading(true);
      
      // Delete datasource from the backend
      await datasourceAPI.deleteProjectDatasource(projectId, deleteItem.id);
      
      // Update local state
      setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
      
      // Update project source count
      if (project) {
        setProject({
          ...project,
          sourceCount: project.sourceCount - 1
        });
      }
      
      setDeleteItem(null);
    } catch (error) {
      console.error(`Failed to delete ${deleteItem.type}:`, error);
      setError(`Failed to delete ${deleteItem.type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !project) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading project details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !project) {
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
  if (!project && !isLoading) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Project not found
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
            onClick={() => navigate('/projects')}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Projects
          </Button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {project?.name}
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

        {/* Project Details Card */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Project Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Description</span>
                  <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {project?.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Created At</span>
                  <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {project?.createdAt}
                  </p>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Total Sources</span>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                      isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project?.sourceCount || 0}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project?.sourceCount === 1 ? 'source' : 'sources'} attached to this project
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className={`p-5 rounded-lg ${
              isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-medium mb-3 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Data Source Status
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Processed
                    </span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {dataSources.filter(ds => ds.status === 'Processed').length}/{dataSources.length}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-[#2e2c50]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        isDark ? 'bg-green-500' : 'bg-green-600'
                      }`}
                      style={{ 
                        width: `${dataSources.length > 0 
                          ? (dataSources.filter(ds => ds.status === 'Processed').length / dataSources.length) * 100
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      In Queue / Extracting
                    </span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {dataSources.filter(ds => ds.status === 'In queue' || ds.status === 'Extracting').length}/{dataSources.length}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-[#2e2c50]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        isDark ? 'bg-yellow-500' : 'bg-yellow-600'
                      }`}
                      style={{ 
                        width: `${dataSources.length > 0 
                          ? (dataSources.filter(ds => ds.status === 'In queue' || ds.status === 'Extracting').length / dataSources.length) * 100
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Not Extracted
                    </span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {dataSources.filter(ds => ds.status === 'Not extracted').length}/{dataSources.length}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-[#2e2c50]' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        isDark ? 'bg-gray-700' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: `${dataSources.length > 0 
                          ? (dataSources.filter(ds => ds.status === 'Not extracted').length / dataSources.length) * 100
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Data Sources
            </h2>
            <Button
              onClick={() => setShowAddDataSourceCard(true)}
              className={`${
                isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          {/* Data Sources Table */}
          {isLoading && dataSources.length === 0 ? (
            <div className={`flex justify-center items-center p-8 rounded-lg border ${
              isDark ? "border-[#2e2c50] bg-[#17162e] text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading data sources...
            </div>
          ) : (
            <DataSourcesTable 
              dataSources={dataSources} 
              isDark={isDark}
              onEditClick={(dataSource) => setEditDataSource(dataSource)}
              sourceType="project" // Specify that this is for a project
            />
          )}
        </div>

        {/* Modals and Sheets */}
        
        {/* Add Data Source Card Modal */}
        {showAddDataSourceCard && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <AddDataSourceCard
              onAdd={addDataSource}
              onCancel={() => setShowAddDataSourceCard(false)}
              isDark={isDark}
            />
          </div>
        )}

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
        {deleteItem && (
          <DeleteConfirmationModal
            itemName={deleteItem.name}
            itemType="Data Source"
            onDelete={handleConfirmDelete}
            onCancel={() => setDeleteItem(null)}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};