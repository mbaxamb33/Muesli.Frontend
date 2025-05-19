// src/services/projectAPI.ts
import axios from 'axios';
import { Project } from '../pages/Projects';
import { DataSource } from '../components/DatasourcesTable';
import { PROJECT_ROUTES, DATASOURCE_ROUTES, BASE_API_URL } from '../api/api-routes';

// Project API endpoints
export const projectAPI = {
  // Get all projects for the current user
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await axios.get(PROJECT_ROUTES.getAllProjects());
      
      // Map the backend response to our frontend Project type
      return response.data.map((project: any) => ({
        id: project.project_id.toString(),
        name: project.project_name,
        description: project.main_idea || '',
        createdAt: project.created_at 
          ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        sourceCount: 0 // This will be updated when we fetch datasources
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Get project by ID
  getProjectById: async (id: string): Promise<Project> => {
    try {
      const response = await axios.get(PROJECT_ROUTES.getProjectById(id));
      
      // Map the backend response to our frontend Project type
      const project = {
        id: response.data.project_id.toString(),
        name: response.data.project_name,
        description: response.data.main_idea || '',
        createdAt: response.data.created_at 
          ? new Date(response.data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        sourceCount: 0
      };
      
      // Fetch datasources count for this project
      try {
        const datasources = await datasourceAPI.getProjectDatasources(id);
        project.sourceCount = datasources.length;
      } catch (error) {
        console.error(`Error fetching datasource count for project ${id}:`, error);
      }
      
      return project;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'sourceCount'>): Promise<Project> => {
    try {
      // Map our frontend Project type to the backend expected format
      const payload = {
        project_name: project.name,
        main_idea: project.description
      };
      
      const response = await axios.post(PROJECT_ROUTES.createProject(), payload);
      
      // Return the created project with the ID from the response
      return {
        id: response.data.project_id.toString(),
        name: response.data.project_name,
        description: response.data.main_idea || '',
        createdAt: response.data.created_at 
          ? new Date(response.data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        sourceCount: 0
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Update an existing project
  updateProject: async (project: Project): Promise<Project> => {
    try {
      // Map our frontend Project type to the backend expected format
      const payload = {
        project_name: project.name,
        main_idea: project.description
      };
      
      const response = await axios.put(PROJECT_ROUTES.updateProject(project.id), payload);
      
      // Return the updated project
      return {
        id: response.data.project_id.toString(),
        name: response.data.project_name,
        description: response.data.main_idea || '',
        createdAt: project.createdAt, // Keep the existing createdAt
        sourceCount: project.sourceCount // Keep the existing sourceCount
      };
    } catch (error) {
      console.error(`Error updating project with ID ${project.id}:`, error);
      throw error;
    }
  },
  
  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    try {
      await axios.delete(PROJECT_ROUTES.deleteProject(id));
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }
};

// DataSource API endpoints for projects
export const datasourceAPI = {
  // Get all datasources for a project
  getProjectDatasources: async (projectId: string): Promise<DataSource[]> => {
    try {
      const response = await axios.get(DATASOURCE_ROUTES.getProjectDataSources(projectId));
      
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
      console.error('Error fetching project datasources:', error);
      throw error;
    }
  },
  
  // Create a new datasource for a project
  createProjectDatasource: async (projectId: string, datasource: Omit<DataSource, 'id'>): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      const response = await axios.post(DATASOURCE_ROUTES.createProjectDataSource(projectId), payload);
      
      return {
        id: response.data.datasource_id.toString(),
        name: datasource.name,
        type: datasource.type,
        status: 'Not extracted',
        link: datasource.link || '',
        filename: datasource.filename || ''
      };
    } catch (error) {
      console.error('Error creating project datasource:', error);
      throw error;
    }
  },
  
  // Update a datasource for a project
  updateProjectDatasource: async (projectId: string, datasource: DataSource): Promise<DataSource> => {
    try {
      const payload = {
        source_type: datasource.type,
        name: datasource.name,
        link: datasource.type === 'website' ? datasource.link : '',
        file_name: datasource.type !== 'website' ? datasource.filename : ''
      };
      
      await axios.put(DATASOURCE_ROUTES.updateProjectDataSource(projectId, datasource.id), payload);
      
      return datasource;
    } catch (error) {
      console.error('Error updating project datasource:', error);
      throw error;
    }
  },
  
  // Delete a datasource from a project
  deleteProjectDatasource: async (projectId: string, datasourceId: string): Promise<void> => {
    try {
      await axios.delete(DATASOURCE_ROUTES.deleteProjectDataSource(projectId, datasourceId));
    } catch (error) {
      console.error('Error deleting project datasource:', error);
      throw error;
    }
  },
  
  // Process a datasource (extract data from it)
  processDatasource: async (datasourceId: string): Promise<void> => {
    try {
      const response = await axios.post(DATASOURCE_ROUTES.processDataSource(datasourceId));
      
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
      const response = await axios.get(DATASOURCE_ROUTES.getDataSourceStatus(datasourceId));
      return response.data.status;
    } catch (error) {
      console.error('Error getting processing status:', error);
      throw error;
    }
  }
};

export default {
  projectAPI,
  datasourceAPI
};