// src/pages/ContactDataSourceDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DataSource } from "../components/DatasourcesTable";
import { Contact } from "../components/ContactsTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { EditIcon, TrashIcon, ArrowLeftIcon, GlobeIcon, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { ModulesSection, Module } from "../components/ModuleSection";

// Sample contacts (in a real app, this would come from an API or global state)
const initialContacts: Record<string, Contact[]> = {
  "1": [
    {
      id: "c1",
      name: "John Smith",
      position: "CEO",
      email: "john.smith@techinnovations.com",
      phone: "+1 (123) 456-7890",
      notes: "Primary contact for strategic decisions"
    },
    {
      id: "c2",
      name: "Jane Doe",
      position: "CTO",
      email: "jane.doe@techinnovations.com",
      phone: "+1 (123) 456-7891",
      notes: "Technical contact for implementation details"
    }
  ],
  "2": [
    {
      id: "c3",
      name: "Mike Johnson",
      position: "Director",
      email: "mike.johnson@greenenergysolutions.com",
      phone: "+1 (987) 654-3210",
      notes: "Main point of contact"
    }
  ],
  "3": [
    {
      id: "c4",
      name: "Sarah Williams",
      position: "CFO",
      email: "sarah.williams@globalfinance.com",
      phone: "+1 (555) 123-4567",
      notes: "Financial discussions and negotiations"
    }
  ]
};

// Sample data sources for contacts
const initialContactDataSources: Record<string, DataSource[]> = {
  "c1": [
    {
      id: "cds1",
      name: "LinkedIn Profile",
      type: "website",
      status: "Processed",
      link: "linkedin.com/in/johnsmith"
    },
    {
      id: "cds2",
      name: "Resume",
      type: "pdf",
      status: "Processed",
      filename: "john_smith_resume.pdf"
    }
  ],
  "c2": [
    {
      id: "cds3",
      name: "GitHub Profile",
      type: "website",
      status: "Not extracted",
      link: "github.com/janedoe"
    }
  ],
  "c3": [
    {
      id: "cds4",
      name: "Industry Conference Presentation",
      type: "pdf",
      status: "In queue",
      filename: "green_energy_presentation.pdf"
    }
  ],
  "c4": [
    {
      id: "cds5",
      name: "Financial Analysis",
      type: "excel",
      status: "Extracting",
      filename: "sarah_financial_analysis.xlsx"
    }
  ]
};

// Sample modules for data sources
const initialModules: Record<string, Module[]> = {
  "cds1": [
    {
      id: "cm1",
      title: "Professional Experience",
      content: "John Smith has over 15 years of experience in the technology sector, with a focus on AI and machine learning applications. Previously served as CTO at Tech Startups Inc. for 5 years before joining Tech Innovations as CEO.",
      mainIdea: "Career history and professional background",
      crawledAt: "May 10, 2025"
    },
    {
      id: "cm2",
      title: "Skills and Expertise",
      content: "Technical expertise in AI, machine learning, and enterprise software development. Strong background in product strategy and business development. Published author on technology leadership and innovation management.",
      mainIdea: "Technical and leadership skills overview",
      crawledAt: "May 10, 2025"
    }
  ],
  "cds2": [
    {
      id: "cm3",
      title: "Education",
      content: "PhD in Computer Science from Stanford University, specializing in artificial intelligence. MBA from Harvard Business School with focus on technology management.",
      mainIdea: "Academic credentials and educational background",
      crawledAt: "May 11, 2025"
    }
  ],
  "cds3": [
    {
      id: "cm4",
      title: "Open Source Contributions",
      content: "Jane Doe is an active contributor to several major open source projects, including TensorFlow and PyTorch. Has created several popular GitHub repositories focused on natural language processing and computer vision applications.",
      mainIdea: "Open source development activities and contributions",
      crawledAt: "May 9, 2025"
    }
  ]
};

// Helper function to find a contact by ID
const findContactById = (contactId: string): Contact | null => {
  for (const companyId in initialContacts) {
    const found = initialContacts[companyId].find(c => c.id === contactId);
    if (found) return found;
  }
  return null;
};

export const ContactDataSourceDetails = (): JSX.Element => {
  const { contactId, dataSourceId } = useParams<{ contactId: string; dataSourceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    // Fetch contact data
    if (contactId) {
      const foundContact = findContactById(contactId);
      setContact(foundContact);
    }
    
    // Fetch data source
    if (contactId && dataSourceId) {
      const contactSources = initialContactDataSources[contactId] || [];
      const foundDataSource = contactSources.find(ds => ds.id === dataSourceId);
      setDataSource(foundDataSource || null);
    }
  }, [contactId, dataSourceId]);

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
    ];
    
    if (contact) {
      items.push({
        label: "Contacts",
        path: "/contacts"
      });
      
      items.push({
        label: contact.name,
        path: `/contacts/${contactId}`
      });
    }
    
    if (dataSource) {
      items.push({
        label: dataSource.name,
        path: `/contacts/${contactId}/datasources/${dataSourceId}`
      });
    }
    
    return items;
  }, [contact, dataSource, contactId, dataSourceId]);

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
    // For now, just navigate back to the contact page
    setShowDeleteModal(false);
    navigate(`/contacts/${contactId}`);
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

  if (!dataSource || !contact) {
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
            onClick={() => navigate(`/contacts/${contactId}`)}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to {contact.name}
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
                    Contact
                  </h3>
                  <p className={`${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {contact.name}
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