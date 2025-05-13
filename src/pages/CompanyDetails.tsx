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
import { companyAPI, datasourceAPI, contactAPI } from "../services/api";

type DeleteItem = {
  type: 'dataSource' | 'contact';
  id: string;
  name: string;
};

export const CompanyDetails = (): JSX.Element => {
  const { companyId } = useParams<{ companyId: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // State variables
  const [company, setCompany] = useState<Company | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [showAddContactCard, setShowAddContactCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  // Create breadcrumbs directly with the company name when available
  const breadcrumbItems = React.useMemo(() => {
    const baseBreadcrumbs = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    if (company) {
      baseBreadcrumbs.push({
        label: company.name,
        path: `/clients/${companyId}`
      });
    }
    
    return baseBreadcrumbs;
  }, [companyId, company]);

  // Fetch company data from the backend
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch company details
        const companyData = await companyAPI.getCompanyById(companyId);
        setCompany(companyData);
        
        // Fetch company datasources
        const dataSources = await datasourceAPI.getCompanyDatasources(companyId);
        setDataSources(dataSources);
        
        // Fetch company contacts
        const contacts = await contactAPI.getCompanyContacts(companyId);
        setContacts(contacts);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [companyId]);

  // DataSource handlers
  const addDataSource = async (dataSource: Omit<DataSource, "id">) => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add datasource to company in the backend
      const newDataSource = await datasourceAPI.createCompanyDatasource(companyId, dataSource);
      
      // Update local state
      setDataSources([...dataSources, newDataSource]);
      
      // Close the add form
      setShowAddDataSourceCard(false);
    } catch (error) {
      console.error("Failed to add datasource:", error);
      setError("Failed to add datasource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDataSource = async (updatedDataSource: DataSource) => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update datasource in the backend
      await datasourceAPI.updateDatasource(companyId, updatedDataSource);
      
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

  // Contact handlers
  const addContact = async (contact: Omit<Contact, "id">) => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add contact to company in the backend
      const newContact = await contactAPI.createContact(companyId, contact);
      
      // Update local state
      setContacts([...contacts, newContact]);
      
      // Close the add form
      setShowAddContactCard(false);
    } catch (error) {
      console.error("Failed to add contact:", error);
      setError("Failed to add contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (updatedContact: Contact) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update contact in the backend
      await contactAPI.updateContact(updatedContact);
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      ));
      
      // Close the edit form
      setEditContact(null);
    } catch (error) {
      console.error("Failed to update contact:", error);
      setError("Failed to update contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = (contact: Contact) => {
    // First close the edit sheet
    setEditContact(null);
    
    // Show delete confirmation modal
    setDeleteItem({
      type: 'contact',
      id: contact.id,
      name: contact.name
    });
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = async () => {
    if (!deleteItem || !companyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (deleteItem.type === 'dataSource') {
        // Delete datasource from the backend
        await datasourceAPI.deleteCompanyDatasource(companyId, deleteItem.id);
        
        // Update local state
        setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
      } else {
        // Delete contact from the backend
        await contactAPI.deleteContact(deleteItem.id);
        
        // Update local state
        setContacts(contacts.filter(contact => contact.id !== deleteItem.id));
      }
    } catch (error) {
      console.error(`Failed to delete ${deleteItem.type}:`, error);
      setError(`Failed to delete ${deleteItem.type}. Please try again.`);
    } finally {
      // Close the delete confirmation modal
      setDeleteItem(null);
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading company details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !company) {
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
  if (!company && !isLoading) {
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
        {/* Breadcrumb navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Company Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {company?.name}
          </h1>
          <div className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {company?.industry} | {company?.status}
          </div>
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
                  {company?.website ? (
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
                  )}
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Address</span>
                  <p>{company?.address || '-'}</p>
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
                {company?.notes || 'No additional notes'}
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
              sourceType="company"
            />
          )}
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
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Contacts Table */}
          {isLoading && contacts.length === 0 ? (
            <div className={`flex justify-center items-center p-8 rounded-lg border ${
              isDark ? "border-[#2e2c50] bg-[#17162e] text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading contacts...
            </div>
          ) : (
            <ContactsTable 
              contacts={contacts} 
              isDark={isDark}
              onEditClick={(contact) => setEditContact(contact)}
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