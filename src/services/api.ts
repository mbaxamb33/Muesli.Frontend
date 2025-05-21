// src/services/api.ts
import apiClient from './apiClient';
import { Module } from '../types/module';
import { DATASOURCE_ROUTES, PARAGRAPH_ROUTES, COMPANY_ROUTES, CONTACT_ROUTES, PROJECT_ROUTES, BASE_API_URL } from '../api/api-routes';
import { projectAPI, datasourceAPI as projectDatasourceAPI } from './projectAPI';

// Company type definition
export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  address: string;
  notes: string;
  status: string;
}

// DataSource type definition
export interface DataSource {
  id: string;
  name: string;
  type: "website" | "audio" | "word" | "pdf" | "excel" | "txt";
  status: "Not extracted" | "In queue" | "Extracting" | "Processed";
  link?: string;
  filename?: string;
}

// Contact type definition
export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
}

// Company API endpoints
export const companyAPI = {
  // Get all companies
  getAllCompanies: async (): Promise<Company[]> => {
    try {
      const response = await apiClient.get(COMPANY_ROUTES.getAllCompanies());
      
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
      const response = await apiClient.get(COMPANY_ROUTES.getCompanyById(id));
      
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
      
      const response = await apiClient.post(COMPANY_ROUTES.createCompany(), payload);
      
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
      
      const response = await apiClient.put(COMPANY_ROUTES.updateCompany(company.id), payload);
      
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
      await apiClient.delete(COMPANY_ROUTES.deleteCompany(id));
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
      const response = await apiClient.get(DATASOURCE_ROUTES.getCompanyDataSources(companyId));
      
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
      const response = await apiClient.get(DATASOURCE_ROUTES.getContactDataSources(contactId));
      
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
      
      const response = await apiClient.post(DATASOURCE_ROUTES.createCompanyDataSource(companyId), payload);
      
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
      
      const response = await apiClient.post(DATASOURCE_ROUTES.createContactDataSource(contactId), payload);
      
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
  
  // Update a datasource
  updateDatasource: async (companyId: string, datasource: DataSource): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      await apiClient.put(DATASOURCE_ROUTES.updateCompanyDataSource(companyId, datasource.id), payload);
      
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
      
      await apiClient.put(DATASOURCE_ROUTES.updateContactDataSource(contactId, datasource.id), payload);
      
      return datasource;
    } catch (error) {
      console.error('Error updating contact datasource:', error);
      throw error;
    }
  },
  
  // Delete a datasource from a company
  deleteCompanyDatasource: async (companyId: string, datasourceId: string): Promise<void> => {
    try {
      await apiClient.delete(DATASOURCE_ROUTES.deleteCompanyDataSource(companyId, datasourceId));
    } catch (error) {
      console.error('Error deleting datasource:', error);
      throw error;
    }
  },
  
  // Delete a datasource from a contact
  deleteContactDatasource: async (contactId: string, datasourceId: string): Promise<void> => {
    try {
      await apiClient.delete(DATASOURCE_ROUTES.deleteContactDataSource(contactId, datasourceId));
    } catch (error) {
      console.error('Error deleting contact datasource:', error);
      throw error;
    }
  },
  
  // Process a datasource (extract data from it)
  processDatasource: async (datasourceId: string): Promise<void> => {
    try {
      const response = await apiClient.post(DATASOURCE_ROUTES.processDataSource(datasourceId));
      
      // Check for successful response
      if (response.status !== 200) {
        throw new Error(`Processing failed with status: ${response.status}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error processing datasource:', error);
      throw error;
    }
  },
  
  // Get processing status of a datasource
  getProcessingStatus: async (datasourceId: string): Promise<string> => {
    try {
      const response = await apiClient.get(DATASOURCE_ROUTES.getDataSourceStatus(datasourceId));
      return response.data.status;
    } catch (error) {
      console.error('Error getting processing status:', error);
      throw error;
    }
  }
};

// Contact API endpoints
export const contactAPI = {
  // Get all contacts for a company
  getCompanyContacts: async (companyId: string): Promise<Contact[]> => {
    try {
      const response = await apiClient.get(CONTACT_ROUTES.getCompanyContacts(companyId));
      
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
      const nameParts = contact.name.trim().split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.length > 1 
        ? nameParts.slice(1).join(' ') 
        : 'Lastname'; // Default last name
     
      const payload = {
        company_id: parseInt(companyId),
        first_name: firstName,
        last_name: lastName,
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
        notes: contact.notes || ''
      };
     
      const response = await apiClient.post(`${BASE_API_URL}/contacts/`, payload);
     
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
      
      const response = await apiClient.put(CONTACT_ROUTES.updateContact(contact.id), payload);
      
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
      await apiClient.delete(CONTACT_ROUTES.deleteContact(contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },
  
  // Get contact by ID
  getContactById: async (contactId: string): Promise<Contact> => {
    try {
      const response = await apiClient.get(CONTACT_ROUTES.getContactById(contactId));
      
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

// Paragraph API endpoints
export const paragraphAPI = {
  // Get all paragraphs for a datasource
  getDataSourceParagraphs: async (datasourceId: string): Promise<Module[]> => {
    try {
      const response = await apiClient.get(PARAGRAPH_ROUTES.getDataSourceParagraphs(datasourceId));
      
      // Handle empty response
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map the backend response to our frontend Module type
      return response.data.map((paragraph: any) => ({
        id: paragraph.paragraph_id.toString(),
        title: paragraph.title || 'Untitled Paragraph',
        content: paragraph.content,
        mainIdea: paragraph.main_idea || '',
        crawledAt: paragraph.created_at 
          ? new Date(paragraph.created_at).toLocaleDateString() 
          : 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching paragraphs:', error);
      
      // Return empty array instead of throwing error to handle 404 gracefully
      // if (error.response?.status === 404) {
      //   return [];
      // }
      
      throw error;
    }
  },
  
  // Update a paragraph
  updateParagraph: async (paragraph: Module): Promise<Module> => {
    try {
      const payload = {
        title: paragraph.title,
        content: paragraph.content,
        main_idea: paragraph.mainIdea
      };
      
      const response = await apiClient.put(PARAGRAPH_ROUTES.updateParagraph(paragraph.id), payload);
      
      return {
        id: response.data.paragraph_id.toString(),
        title: response.data.title || paragraph.title,
        content: response.data.content,
        mainIdea: response.data.main_idea || paragraph.mainIdea,
        crawledAt: paragraph.crawledAt
      };
    } catch (error) {
      console.error('Error updating paragraph:', error);
      throw error;
    }
  },
  
  // Delete a paragraph
  deleteParagraph: async (paragraphId: string): Promise<void> => {
    try {
      await apiClient.delete(PARAGRAPH_ROUTES.deleteParagraph(paragraphId));
    } catch (error) {
      console.error('Error deleting paragraph:', error);
      throw error;
    }
  },
  
  // Create a new paragraph
  createParagraph: async (datasourceId: string, paragraph: Omit<Module, "id" | "crawledAt">): Promise<Module> => {
    try {
      const payload = {
        datasource_id: datasourceId,
        title: paragraph.title,
        content: paragraph.content,
        main_idea: paragraph.mainIdea
      };
      
      const response = await apiClient.post(PARAGRAPH_ROUTES.createParagraph(), payload);
      
      return {
        id: response.data.paragraph_id.toString(),
        title: response.data.title || 'Untitled Paragraph',
        content: response.data.content,
        mainIdea: response.data.main_idea || '',
        crawledAt: new Date().toLocaleDateString()
      };
    } catch (error) {
      console.error('Error creating paragraph:', error);
      throw error;
    }
  }
};

// Export project APIs from projectAPI.ts
export { projectAPI, projectDatasourceAPI };

export default {
  companyAPI,
  datasourceAPI,
  contactAPI,
  paragraphAPI,
  projectAPI,
  projectDatasourceAPI
};