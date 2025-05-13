// src/pages/ProjectDataSourceDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Project } from "./Projects";
import { DataSource } from "../components/DatasourcesTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { EditIcon, TrashIcon, ArrowLeftIcon, GlobeIcon, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { ModulesSection, Module } from "../components/ModuleSection";

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

// Sample modules for data sources
const initialModules: Record<string, Module[]> = {
  "pds1": [
    {
      id: "pm1",
      title: "Current Website Issues",
      content: "The current website has several usability problems and outdated design elements. Navigation is difficult, especially on mobile devices. Load times are slow due to unoptimized images and excessive JavaScript. The site is not accessible for users with disabilities.",
      mainIdea: "Summary of problems with the current website",
      crawledAt: "May 2, 2025"
    },
    {
      id: "pm2",
      title: "Competitive Analysis",
      content: "Analysis of 5 competitor websites shows trends toward minimalist design, improved mobile experiences, and integration of interactive elements. Most competitors have implemented dark mode options and accessibility features. Load times average under 3 seconds.",
      mainIdea: "Market research on competitor website designs",
      crawledAt: "May 2, 2025"
    }
  ],
  "pds2": [
    {
      id: "pm3",
      title: "Design Inspiration",
      content: "Collection of design elements and user interactions from leading websites in the industry. Notable features include sticky navigation, parallax scrolling effects, and subtle animations that enhance user experience without becoming distracting.",
      mainIdea: "Noteworthy design elements from other websites",
      crawledAt: "May 3, 2025"
    }
  ],
  "pds6": [
    {
      id: "pm4",
      title: "Core Functionality",
      content: "The mobile application must support user authentication, profile management, product browsing, cart/checkout process, order history, and notification preferences. Integration with existing backend systems is required. The app should work offline for basic browsing functionality.",
      mainIdea: "Essential features for the mobile application",
      crawledAt: "April 16, 2025"
    }
  ]
};

export const ProjectDataSourceDetails = (): JSX.Element => {
  const { projectId, dataSourceId } = useParams<{ projectId: string; dataSourceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    // Fetch project data
    if (projectId) {
      const foundProject = initialProjects.find(p => p.id === projectId);
      setProject(foundProject || null);
    }
    
    // Fetch data source
    if (projectId && dataSourceId) {
      const projectSources = initialProjectDataSources[projectId] || [];
      const foundDataSource = projectSources.find(ds => ds.id === dataSourceId);
      setDataSource(foundDataSource || null);
    }
  }, [projectId, dataSourceId]);

  // Load modules for this data source
  useEffect(() => {
    if (dataSourceId) {
      setModules(initialModules[dataSourceId] || []);
    }
  }, [dataSourceId]);

  // Generate breadcrumb items
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
    
    if (dataSource) {
      items.push({
        label: dataSource.name,
        path: `/projects/${projectId}/datasources/${dataSourceId}`
      });
    }
    
    return items;
  }, [project, dataSource, projectId, dataSourceId]);

  const handleEdit = () => {
    if (dataSource) {
      setEditDataSource(dataSource);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would make an API call to delete the data source
    // For now, just navigate back to the project page
    setShowDeleteModal(false);
    navigate(`/projects/${projectId}`);
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

  // Module handlers
  const updateModule = (updatedModule: Module) => {
    setModules(modules.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    ));
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
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

  if (!dataSource || !project) {
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
            onClick={() => navigate(`/projects/${projectId}`)}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to {project.name}
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
                    Project
                  </h3>
                  <p className={`${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {project.name}
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

        {/* Modules Section */}
        <div className="mt-8">
          <ModulesSection 
            modules={modules}
            isDark={isDark}
            onUpdateModule={updateModule}
            onDeleteModule={deleteModule}
          />
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
            itemName={dataSource.name}
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