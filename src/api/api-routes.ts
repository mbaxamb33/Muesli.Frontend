// src/api/api-routes.ts
// This file contains all the API routes for the application

// Base API URL
export const BASE_API_URL = '/api/v1';

// DataSource routes
export const DATASOURCE_ROUTES = {
  // Get all data sources for a company
  getCompanyDataSources: (companyId: string) => `${BASE_API_URL}/companies/${companyId}/datasources`,
  
  // Get all data sources for a contact
  getContactDataSources: (contactId: string) => `${BASE_API_URL}/contacts/${contactId}/datasources`,
  
  // Get all data sources for a project
  getProjectDataSources: (projectId: string) => `${BASE_API_URL}/projects/${projectId}/datasources`,
  
  // Process a data source
  processDataSource: (dataSourceId: string) => `${BASE_API_URL}/datasources/${dataSourceId}/process`,
  
  // Get processing status of a data source
  getDataSourceStatus: (dataSourceId: string) => `${BASE_API_URL}/datasources/${dataSourceId}/status`,
  
  // Create a data source for a company
  createCompanyDataSource: (companyId: string) => `${BASE_API_URL}/companies/${companyId}/datasources`,
  
  // Update a data source for a company
  updateCompanyDataSource: (companyId: string, dataSourceId: string) => 
    `${BASE_API_URL}/companies/${companyId}/datasources/${dataSourceId}`,
  
  // Delete a data source from a company
  deleteCompanyDataSource: (companyId: string, dataSourceId: string) => 
    `${BASE_API_URL}/companies/${companyId}/datasources/${dataSourceId}`,
};

// Paragraph routes
export const PARAGRAPH_ROUTES = {
  // Get all paragraphs for a data source
  getDataSourceParagraphs: (dataSourceId: string) => `${BASE_API_URL}/paragraphs/datasource/${dataSourceId}`,
  
  // Create a paragraph
  createParagraph: () => `${BASE_API_URL}/paragraphs`,
  
  // Update a paragraph
  updateParagraph: (paragraphId: string) => `${BASE_API_URL}/paragraphs/${paragraphId}`,
  
  // Delete a paragraph
  deleteParagraph: (paragraphId: string) => `${BASE_API_URL}/paragraphs/${paragraphId}`,
};

// Company routes
export const COMPANY_ROUTES = {
  // Get all companies
  getAllCompanies: () => `${BASE_API_URL}/companies`,
  
  // Get a company by ID
  getCompanyById: (companyId: string) => `${BASE_API_URL}/companies/${companyId}`,
  
  // Create a company
  createCompany: () => `${BASE_API_URL}/companies`,
  
  // Update a company
  updateCompany: (companyId: string) => `${BASE_API_URL}/companies/${companyId}`,
  
  // Delete a company
  deleteCompany: (companyId: string) => `${BASE_API_URL}/companies/${companyId}`,
};

// Contact routes
export const CONTACT_ROUTES = {
  // Get all contacts for a company
  getCompanyContacts: (companyId: string) => `${BASE_API_URL}/contacts/company/${companyId}`,
  
  // Get a contact by ID
  getContactById: (contactId: string) => `${BASE_API_URL}/contacts/${contactId}`,
  
  // Create a contact
  createContact: () => `${BASE_API_URL}/contacts`,
  
  // Update a contact
  updateContact: (contactId: string) => `${BASE_API_URL}/contacts/${contactId}`,
  
  // Delete a contact
  deleteContact: (contactId: string) => `${BASE_API_URL}/contacts/${contactId}`,
};

// Project routes
export const PROJECT_ROUTES = {
  // Get all projects
  getAllProjects: () => `${BASE_API_URL}/projects`,
  
  // Get a project by ID
  getProjectById: (projectId: string) => `${BASE_API_URL}/projects/${projectId}`,
  
  // Create a project
  createProject: () => `${BASE_API_URL}/projects`,
  
  // Update a project
  updateProject: (projectId: string) => `${BASE_API_URL}/projects/${projectId}`,
  
  // Delete a project
  deleteProject: (projectId: string) => `${BASE_API_URL}/projects/${projectId}`,
};