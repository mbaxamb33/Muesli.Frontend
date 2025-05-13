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

// Sample projects (in a real app, this would come from an API or global state)
const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    createdAt: "May 1, 2025",
    sourceCount: 5
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Build native apps for iOS and Android platforms",
    createdAt: "April 15, 2025",
    sourceCount: 8
  },
  {
    id: "3",
    name: "Data Migration",
    description: "Transfer data from legacy systems to new platform",
    createdAt: "March 30, 2025",
    sourceCount: 3
  },
  {
    id: "4",
    name: "Brand Identity Update",
    description: "Refresh company logo, colors, and design language",
    createdAt: "May 5, 2025",
    sourceCount: 12
  },
  {
    id: "5",
    name: "Customer Portal",
    description: "Develop self-service portal for customer account management",
    createdAt: "April 28, 2025",
    sourceCount: 7
  }
];

// Sample data sources for projects
const initialProjectDataSources: Record<string, DataSource[]> = {
  "1": [
    {
      id: "pds1",
      name: "Current Website Analysis",
      type: "pdf",
      status: "Processed",
      filename: "current_website_analysis.pdf"
    },
    {
      id: "pds2",
      name: "Competitor Websites",
      type: "website",
      status: "Processed",
      link: "competitor-analysis.com"
    },
    {
      id: "pds3",
      name: "Brand Guidelines",
      type: "pdf",
      status: "Processed",
      filename: "brand_guidelines_2025.pdf"
    },
    {
      id: "pds4",
      name: "Wireframes",
      type: "pdf",
      status: "In queue",
      filename: "wireframes_v2.pdf"
    },
    {
      id: "pds5",
      name: "User Feedback",
      type: "excel",
      status: "Extracting",
      filename: "user_feedback_survey.xlsx"
    }
  ],
  "2": [
    {
      id: "pds6",
      name: "Mobile App Requirements",
      type: "word",
      status: "Processed",
      filename: "app_requirements.docx"
    },
    {
      id: "pds7",
      name: "UI/UX Design Files",
      type: "website",
      status: "Not extracted",
      link: "figma.com/design-files"
    }
  ]
};

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
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    if (projectId) {
      const foundProject = initialProjects.find(p => p.id === projectId);
      setProject(foundProject || null);
      
      // Load data sources for this project
      setDataSources(initialProjectDataSources[projectId] || []);
    }
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

  // Data source handlers
  const addDataSource = (dataSource: Omit<DataSource, "id">) => {
    const newDataSource = {
      ...dataSource,
      id: Math.random().toString(36).substring(2, 9)
    };
    setDataSources([...dataSources, newDataSource]);
    
    // Also update the project's source count
    if (project) {
      const updatedProject = {
        ...project,
        sourceCount: project.sourceCount + 1
      };
      setProject(updatedProject);
    }
    
    setShowAddDataSourceCard(false);
  };

  const updateDataSource = (updatedDataSource: DataSource) => {
    setDataSources(dataSources.map(ds => 
      ds.id === updatedDataSource.id ? updatedDataSource : ds
    ));
    setEditDataSource(null);
  };

  const deleteDataSource = (dataSource: DataSource) => {
    // First close the edit sheet
    setEditDataSource(null);
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setDeleteItem({
        type: 'dataSource',
        id: dataSource.id,
        name: dataSource.name
      });
    }, 100);
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
    
    // Also update the project's source count
    if (project) {
      const updatedProject = {
        ...project,
        sourceCount: project.sourceCount - 1
      };
      setProject(updatedProject);
    }
    
    setDeleteItem(null);
  };

  if (!project) {
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
            {project.name}
          </h1>
        </div>

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
                    {project.description}
                  </p>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Created At</span>
                  <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {project.createdAt}
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
                      {project.sourceCount}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project.sourceCount === 1 ? 'source' : 'sources'} attached to this project
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
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          {/* Data Sources Table */}
          <DataSourcesTable 
            dataSources={dataSources} 
            isDark={isDark}
            onEditClick={(dataSource) => setEditDataSource(dataSource)}
            sourceType="project" // Specify that this is for a project
          />
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