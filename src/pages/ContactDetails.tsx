import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Contact } from "../components/ContactsTable";
import { DataSource } from "../components/Datas ourcesTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { PlusIcon, ArrowLeftIcon, PhoneIcon, MailIcon, Edit2Icon } from "lucide-react";
import { DataSourcesTable } from "../components/DatasourcesTable";
import { AddDataSourceCard } from "../components/AddDataSourceCard";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";
import { EditContactSheet } from "../components/EditContactSheet";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { contactAPI, datasourceAPI } from "../services/api";

type DeleteItem = {
  type: 'dataSource' | 'contact';
  id: string;
  name: string;
};

export const ContactDetails = (): JSX.Element => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // State variables
  const [contact, setContact] = useState<Contact | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  // Create breadcrumbs for contact
  const breadcrumbItems = React.useMemo(() => {
    const baseBreadcrumbs = [
      { label: "Home", path: "/" },
      { label: "Contacts", path: "/contacts" }
    ];
    
    if (contact) {
      baseBreadcrumbs.push({
        label: contact.name,
        path: `/contacts/${contactId}`
      });
    }
    
    return baseBreadcrumbs;
  }, [contactId, contact]);

  // Fetch contact data from the backend
  useEffect(() => {
    const fetchContactData = async () => {
      if (!contactId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch contact details
        const contactData = await contactAPI.getContactById(contactId);
        setContact(contactData);
        
        // Fetch contact datasources
        const datasources = await datasourceAPI.getContactDatasources(contactId);
        setDataSources(datasources);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError("Failed to load contact details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactData();
  }, [contactId]);

  // DataSource handlers
  const addDataSource = async (dataSource: Omit<DataSource, "id">) => {
    if (!contactId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add datasource to contact in the backend
      const newDataSource = await datasourceAPI.createContactDatasource(contactId, dataSource);
      
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
    if (!contactId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update datasource in the backend
      await datasourceAPI.updateContactDatasource(contactId, updatedDataSource);
      
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
  const updateContact = async (updatedContact: Contact) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update contact in the backend
      const result = await contactAPI.updateContact(updatedContact);
      
      // Update local state
      setContact(result);
      
      // Close the edit form
      setIsEditingContact(false);
    } catch (error) {
      console.error("Failed to update contact:", error);
      setError("Failed to update contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = () => {
    if (!contact) return;
    
    // Show delete confirmation modal
    setDeleteItem({
      type: 'contact',
      id: contact.id,
      name: contact.name
    });
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = async () => {
    if (!deleteItem || !contactId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (deleteItem.type === 'dataSource') {
        // Delete datasource from the backend
        await datasourceAPI.deleteContactDatasource(contactId, deleteItem.id);
        
        // Update local state
        setDataSources(dataSources.filter(ds => ds.id !== deleteItem.id));
        setDeleteItem(null);
      } else {
        // Delete contact from the backend
        await contactAPI.deleteContact(contactId);
        
        // Navigate back to contacts list
        navigate('/contacts');
      }
    } catch (error) {
      console.error(`Failed to delete ${deleteItem.type}:`, error);
      setError(`Failed to delete ${deleteItem.type}. Please try again.`);
      setDeleteItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !contact) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading contact details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !contact) {
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
  if (!contact && !isLoading) {
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Breadcrumb navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className={`${
              isDark ? "text-gray-300 hover:bg-[#201e3d]" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>
        
        {/* Contact Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {contact?.name}
            </h1>
            <div className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {contact?.position}
            </div>
          </div>
          
          <Button
            onClick={() => setIsEditingContact(true)}
            className={`${
              isDark 
              ? "border-[#2e2c50] bg-[#201e3d] text-white hover:bg-[#2a2850]" 
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
            variant="outline"
          >
            <Edit2Icon className="w-4 h-4 mr-2" />
            Edit Contact
          </Button>
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

        {/* Contact Details Card */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Contact Information */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Contact Information
              </h2>
              <div className="space-y-3">
                {contact?.email && (
                  <div>
                    <span className={`block text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email</span>
                    <a 
                      href={`mailto:${contact?.email}`}
                      className={`flex items-center ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      <MailIcon className="w-4 h-4 mr-2" />
                      {contact?.email}
                    </a>
                  </div>
                )}
                
                {contact?.phone && (
                  <div>
                    <span className={`block text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Phone</span>
                    <a 
                      href={`tel:${contact?.phone}`}
                      className={`flex items-center ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      {contact?.phone}
                    </a>
                  </div>
                )}
                
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Position</span>
                  <p>{contact?.position || '-'}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Notes */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Notes
              </h2>
              <p className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {contact?.notes || 'No additional notes'}
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
              sourceType="contact"
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

        {/* Edit Contact Sheet */}
        {contact && (
          <EditContactSheet
            contact={contact}
            onUpdate={updateContact}
            onDelete={deleteContact}
            onClose={() => setIsEditingContact(false)}
            open={isEditingContact}
            isDark={isDark}
          />
        )}

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