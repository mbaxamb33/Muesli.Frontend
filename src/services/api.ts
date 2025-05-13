// src/services/api.ts
import axios from 'axios';
import { Company } from '../pages/Clients';
import { DataSource } from '../components/DatasourcesTable';
import { Contact } from '../components/ContactsTable';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api/v1', // Relative URL for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Company API endpoints
export const companyAPI = {
  // Get all companies
  getAllCompanies: async (): Promise<Company[]> => {
    try {
      const response = await api.get('/companies');
      
      // Map the backend response to our frontend Company type
      return response.data.map((company: any) => ({
        id: company.company_id.toString(),
        name: company.company_name,
        industry: company.industry || '',
        website: company.website || '',
        address: company.address || '',
        notes: company.description || '',
        status: company.status || 'Active' // Default status if not provided by backend
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },
  
  // Get company by ID
  getCompanyById: async (id: string): Promise<Company> => {
    try {
      const response = await api.get(`/companies/${id}`);
      
      // Map the backend response to our frontend Company type
      return {
        id: response.data.company_id.toString(),
        name: response.data.company_name,
        industry: response.data.industry || '',
        website: response.data.website || '',
        address: response.data.address || '',
        notes: response.data.description || '',
        status: response.data.status || 'Active'
      };
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new company
  createCompany: async (company: Omit<Company, 'id'>): Promise<Company> => {
    try {
      // Map our frontend Company type to the backend expected format
      const payload = {
        company_name: company.name,
        industry: company.industry,
        website: company.website,
        address: company.address,
        description: company.notes,
        status: company.status || 'Active'
      };
      
      const response = await api.post('/companies', payload);
      
      // Return the created company with the ID from the response
      return {
        id: response.data.company_id.toString(),
        name: response.data.company_name,
        industry: response.data.industry || '',
        website: response.data.website || '',
        address: response.data.address || '',
        notes: response.data.description || '',
        status: response.data.status || 'Active'
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },
  
  // Update an existing company
  updateCompany: async (company: Company): Promise<Company> => {
    try {
      // Map our frontend Company type to the backend expected format
      const payload = {
        company_name: company.name,
        industry: company.industry,
        website: company.website,
        address: company.address,
        description: company.notes,
        status: company.status || 'Active'
      };
      
      const response = await api.put(`/companies/${company.id}`, payload);
      
      // Return the updated company
      return {
        id: response.data.company_id.toString(),
        name: response.data.company_name,
        industry: response.data.industry || '',
        website: response.data.website || '',
        address: response.data.address || '',
        notes: response.data.description || '',
        status: response.data.status || 'Active'
      };
    } catch (error) {
      console.error(`Error updating company with ID ${company.id}:`, error);
      throw error;
    }
  },
  
  // Delete a company
  deleteCompany: async (id: string): Promise<void> => {
    try {
      await api.delete(`/companies/${id}`);
    } catch (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
      throw error;
    }
  }
};

// DataSource API endpoints
export const datasourceAPI = {
  // Get all datasources for a company
  getCompanyDatasources: async (companyId: string): Promise<DataSource[]> => {
    try {
      const response = await api.get(`/companies/${companyId}/datasources`);
      
      // Map the backend response to our frontend DataSource type
      return response.data.map((datasource: any) => ({
        id: datasource.datasource_id.toString(),
        name: datasource.name || datasource.file_name || 'Unnamed Source',
        type: datasource.source_type.toLowerCase(),
        status: datasource.status || 'Not extracted',
        link: datasource.link || '',
        filename: datasource.file_name || ''
      }));
    } catch (error) {
      console.error('Error fetching datasources:', error);
      throw error;
    }
  },
  
  // Get all datasources for a contact
  getContactDatasources: async (contactId: string): Promise<DataSource[]> => {
    try {
      const response = await api.get(`/contacts/${contactId}/datasources`);
      
      // Map the backend response to our frontend DataSource type
      return response.data.map((datasource: any) => ({
        id: datasource.datasource_id.toString(),
        name: datasource.name || datasource.file_name || 'Unnamed Source',
        type: datasource.source_type.toLowerCase(),
        status: datasource.status || 'Not extracted',
        link: datasource.link || '',
        filename: datasource.file_name || ''
      }));
    } catch (error) {
      console.error('Error fetching contact datasources:', error);
      throw error;
    }
  },
  
  // Create a new datasource for a company
  createCompanyDatasource: async (companyId: string, datasource: Omit<DataSource, 'id'>): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      const response = await api.post(`/companies/${companyId}/datasources`, payload);
      
      return {
        id: response.data.datasource_id.toString(),
        name: datasource.name,
        type: datasource.type,
        status: 'Not extracted',
        link: datasource.link || '',
        filename: datasource.filename || ''
      };
    } catch (error) {
      console.error('Error creating datasource:', error);
      throw error;
    }
  },
  
  // Create a new datasource for a contact
  createContactDatasource: async (contactId: string, datasource: Omit<DataSource, 'id'>): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      const response = await api.post(`/contacts/${contactId}/datasources`, payload);
      
      return {
        id: response.data.datasource_id.toString(),
        name: datasource.name,
        type: datasource.type,
        status: 'Not extracted',
        link: datasource.link || '',
        filename: datasource.filename || ''
      };
    } catch (error) {
      console.error('Error creating contact datasource:', error);
      throw error;
    }
  },
  
  // Update a datasource for a company
  updateDatasource: async (companyId: string, datasource: DataSource): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      // If the API supports updating datasources
      await api.put(`/companies/${companyId}/datasources/${datasource.id}`, payload);
      
      return datasource;
    } catch (error) {
      console.error('Error updating datasource:', error);
      throw error;
    }
  },
  
  // Update a datasource for a contact
  updateContactDatasource: async (contactId: string, datasource: DataSource): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      // If the API supports updating datasources
      await api.put(`/contacts/${contactId}/datasources/${datasource.id}`, payload);
      
      return datasource;
    } catch (error) {
      console.error('Error updating contact datasource:', error);
      throw error;
    }
  },
  
  // Delete a datasource from a company
  deleteCompanyDatasource: async (companyId: string, datasourceId: string): Promise<void> => {
    try {
      await api.delete(`/companies/${companyId}/datasources/${datasourceId}`);
    } catch (error) {
      console.error('Error deleting datasource:', error);
      throw error;
    }
  },
  
  // Delete a datasource from a contact
  deleteContactDatasource: async (contactId: string, datasourceId: string): Promise<void> => {
    try {
      await api.delete(`/contacts/${contactId}/datasources/${datasourceId}`);
    } catch (error) {
      console.error('Error deleting contact datasource:', error);
      throw error;
    }
  },
  
  // Process a datasource (extract data from it)
  processDatasource: async (datasourceId: string): Promise<void> => {
    try {
      await api.post(`/datasources/${datasourceId}/process`);
    } catch (error) {
      console.error('Error processing datasource:', error);
      throw error;
    }
  }
};

// Contact API endpoints
export const contactAPI = {
  // Get all contacts for a company
  getCompanyContacts: async (companyId: string): Promise<Contact[]> => {
    try {
      const response = await api.get(`/contacts/company/${companyId}`);
      
      // Map the backend response to our frontend Contact type
      return response.data.map((contact: any) => ({
        id: contact.contact_id.toString(),
        name: `${contact.first_name} ${contact.last_name}`,
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
        notes: contact.notes || ''
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  
  // Create a new contact for a company
  createContact: async (companyId: string, contact: Omit<Contact, 'id'>): Promise<Contact> => {
    try {
      // Split the name into first name and last name
      const nameParts = contact.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const payload = {
        company_id: parseInt(companyId),
        first_name: firstName,
        last_name: lastName,
        position: contact.position,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes
      };
      
      const response = await api.post('/contacts', payload);
      
      return {
        id: response.data.contact_id.toString(),
        name: `${response.data.first_name} ${response.data.last_name}`,
        position: response.data.position || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        notes: response.data.notes || ''
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  
  // Update an existing contact
  updateContact: async (contact: Contact): Promise<Contact> => {
    try {
      // Split the name into first name and last name
      const nameParts = contact.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const payload = {
        first_name: firstName,
        last_name: lastName,
        position: contact.position,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes
      };
      
      const response = await api.put(`/contacts/${contact.id}`, payload);
      
      return {
        id: response.data.contact_id.toString(),
        name: `${response.data.first_name} ${response.data.last_name}`,
        position: response.data.position || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        notes: response.data.notes || ''
      };
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },
  
  // Delete a contact
  deleteContact: async (contactId: string): Promise<void> => {
    try {
      await api.delete(`/contacts/${contactId}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },
  
  // Get contact by ID
  getContactById: async (contactId: string): Promise<Contact> => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      
      return {
        id: response.data.contact_id.toString(),
        name: `${response.data.first_name} ${response.data.last_name}`,
        position: response.data.position || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        notes: response.data.notes || ''
      };
    } catch (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      throw error;
    }
  }
};

export default api;