import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Company } from "./Clients";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { PlusIcon } from "lucide-react";
import { DataSourcesTable, DataSource } from "../components/DatasourcesTable";
import { AddDataSourceCard } from "../components/AddDataSourceCard";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { ContactsTable, Contact } from "../components/ContactsTable";
import { AddContactCard } from "../components/AddContactCard";
import { EditContactSheet } from "../components/EditContactSheet";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";

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

// Sample data sources
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

// Sample contacts
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

type DeleteItem = {
  type: 'dataSource' | 'contact';
  id: string;
  name: string;
};

export const CompanyDetails = (): JSX.Element => {
  const { companyId } = useParams<{ companyId: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [company, setCompany] = useState<Company | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [showAddContactCard, setShowAddContactCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  // Create breadcrumbs directly with the company name when available
  const breadcrumbItems = React.useMemo(() => {
    // Use a simplified approach to create breadcrumbs
    const baseBreadcrumbs = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    // Add the company name as the last breadcrumb if it's available
    if (company) {
      baseBreadcrumbs.push({
        label: company.name,
        path: `/clients/${companyId}`
      });
    }
    
    return baseBreadcrumbs;
  }, [companyId, company]);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCompany = initialCompanies.find(c => c.id === companyId);
    setCompany(foundCompany || null);
    
    // Load data sources for this company
    if (companyId) {
      setDataSources(initialDataSources[companyId] || []);
      setContacts(initialContacts[companyId] || []);
    }
  }, [companyId]);
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
        type: 'dataSource',
        id: dataSource.id,
        name: dataSource.name
      });
    }, 100);
  };
  // Contact handlers
  const addContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: Math.random().toString(36).substring(2, 9)
    };
    setContacts([...contacts, newContact]);
    setShowAddContactCard(false);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setEditContact(null);
  };

  const deleteContact = (contact: Contact) => {
    // First close the edit sheet
    setEditContact(null);
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setDeleteItem({
        type: 'contact',
        id: contact.id,
        name: contact.name
      });
    }, 100);
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    if (deleteItem.type === 'dataSource') {
      setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
    } else {
      setContacts(contacts.filter(contact => contact.id !== deleteItem.id));
    }
    setDeleteItem(null);
  };

  if (!company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Company not found
        </p>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Simplified breadcrumb implementation that doesn't rely on async resolution */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Company Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {company.name}
          </h1>
          <div className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {company.industry} | {company.status}
          </div>
        </div>

        {/* Company Details Card */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Company Information
              </h2>
              <div className="space-y-3">
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
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Address</span>
                  <p>{company.address}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Additional Notes
              </h2>
              <p className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {company.notes || 'No additional notes'}
              </p>
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
          />
        </div>

        {/* Contacts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Contacts
            </h2>
            <Button
              onClick={() => setShowAddContactCard(true)}
              className={`${
                isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Contacts Table */}
          <ContactsTable 
            contacts={contacts} 
            isDark={isDark}
            onEditClick={(contact) => setEditContact(contact)}
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

        {/* Add Contact Card Modal */}
        {showAddContactCard && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <AddContactCard
              onAdd={addContact}
              onCancel={() => setShowAddContactCard(false)}
              isDark={isDark}
            />
          </div>
        )}

        {/* Edit Contact Sheet */}
        <EditContactSheet
          contact={editContact}
          onUpdate={updateContact}
          onDelete={deleteContact}
          onClose={() => setEditContact(null)}
          open={editContact !== null}
          isDark={isDark}
        />

        {/* Delete Confirmation Modal */}
        {deleteItem && (
          <DeleteConfirmationModal
            itemName={deleteItem.name}
            itemType={deleteItem.type === 'dataSource' ? 'Data Source' : 'Contact'}
            onDelete={handleConfirmDelete}
            onCancel={() => setDeleteItem(null)}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};