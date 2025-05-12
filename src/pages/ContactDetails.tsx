// src/pages/ContactDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Contact } from "../components/ContactsTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { PlusIcon, ArrowLeftIcon, MailIcon, PhoneIcon } from "lucide-react";
import { DataSourcesTable, DataSource } from "../components/DatasourcesTable";
import { AddDataSourceCard } from "../components/AddDataSourceCard";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { Company } from "./Clients";

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

// Helper function to find a contact across all companies
const findContactById = (contactId: string): Contact | null => {
  for (const companyId in initialContacts) {
    const found = initialContacts[companyId].find(c => c.id === contactId);
    if (found) return found;
  }
  return null;
};

// Helper function to find which company a contact belongs to
const findCompanyForContact = (contactId: string): Company | null => {
  for (const companyId in initialContacts) {
    const found = initialContacts[companyId].find(c => c.id === contactId);
    if (found) {
      const company = initialCompanies.find(c => c.id === companyId);
      return company || null;
    }
  }
  return null;
};

export const ContactDetails = (): JSX.Element => {
  const { contactId, companyId } = useParams<{ contactId: string; companyId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [deleteItem, setDeleteItem] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    if (contactId) {
      // Find contact by ID
      const foundContact = findContactById(contactId);
      setContact(foundContact);
      
      // Find the company this contact belongs to
      const foundCompany = findCompanyForContact(contactId);
      setCompany(foundCompany);
      
      // Load data sources for this contact
      setDataSources(initialContactDataSources[contactId] || []);
    }
  }, [contactId, companyId]);

  // Generate breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    if (company) {
      items.push({
        label: company.name,
        path: `/clients/${company.id}`
      });
    }
    
    if (contact) {
      items.push({
        label: contact.name,
        path: `/contacts/${contactId}`
      });
    }
    
    return items;
  }, [company, contact, contactId]);

  // Data source handlers
  const addDataSource = (dataSource: Omit<DataSource, "id">) => {
    const newDataSource = {
      ...dataSource,
      id: Math.random().toString(36).substring(2, 9)
    };
    setDataSources([...dataSources, newDataSource]);
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
        id: dataSource.id,
        name: dataSource.name
      });
    }, 100);
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
    setDeleteItem(null);
  };

  if (!contact) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Contact not found
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
          {company && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/clients/${company.id}`)}
              className={`mr-4 ${
                isDark 
                ? "text-gray-300 hover:bg-[#201e3d]" 
                : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to {company.name}
            </Button>
          )}
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {contact.name}
          </h1>
        </div>

        {/* Contact Details Card */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Position</span>
                  <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {contact.position}
                  </p>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Email</span>
                  <a 
                    href={`mailto:${contact.email}`}
                    className={`flex items-center ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <MailIcon className="w-4 h-4 mr-2" />
                    {contact.email}
                  </a>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Phone</span>
                  <a 
                    href={`tel:${contact.phone}`}
                    className={`flex items-center ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Company Information
              </h2>
              {company ? (
                <div className="space-y-4">
                  <div>
                    <span className={`block text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Company</span>
                    <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {company.name}
                    </p>
                  </div>
                  <div>
                    <span className={`block text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Industry</span>
                    <p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {company.industry}
                    </p>
                  </div>
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
                </div>
              ) : (
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Company information not available
                </p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6">
            <h2 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Notes
            </h2>
            <p className={`${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {contact.notes || 'No notes available'}
            </p>
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
            sourceType="contact" // Specify that this is for a contact
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