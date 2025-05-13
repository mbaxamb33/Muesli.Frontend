// src/services/api.ts
import axios from 'axios';
import { Company } from '../pages/Clients';

// Create axios instance with base URL
// src/services/api.ts
const api = axios.create({
  baseURL: '/api/v1', // Changed from http://localhost:8080/api/v1 to relative URL
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

export default api;