// src/pages/Projects.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { PageTemplate } from "../components/PageTemplate";
import { PlusIcon, SearchIcon, EditIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { AddProjectCard } from "../components/AddProjectCard";
import { EditProjectSheet } from "../components/EditProjectSheet";
import { getBreadcrumbsFromPath } from "../utils/breadcrumb";
import { projectAPI } from "../services/projectAPI";

// Define Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  sourceCount: number;
}

export const Projects = (): JSX.Element => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get breadcrumb items for the projects page
  const breadcrumbItems = React.useMemo(() => {
    return getBreadcrumbsFromPath("/projects");
  }, []);

  // Fetch projects from API when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await projectAPI.getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handler for project row click - navigate to project details
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // Handler for edit click - open edit sheet
  const handleEditClick = (project: Project) => {
    setEditProject(project);
  };

  // Handler for delete click from the sheet
  const handleDeleteClick = (project: Project) => {
    setEditProject(null); // Close edit sheet
    setTimeout(() => {
      setProjectToDelete(project);
    }, 100);
  };

  // Add new project
  const addProject = async (project: Omit<Project, "id" | "sourceCount">) => {
    try {
      setIsLoading(true);
      const newProject = await projectAPI.createProject(project);
      setProjects([...projects, newProject]);
      setShowAddProject(false);
    } catch (error) {
      console.error("Failed to add project", error);
      setError("Failed to add project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update project
  const updateProject = async (updatedProject: Project) => {
    try {
      setIsLoading(true);
      await projectAPI.updateProject(updatedProject);
      setProjects(projects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      ));
      setEditProject(null);
    } catch (error) {
      console.error("Failed to update project", error);
      setError("Failed to update project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm project deletion
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      setIsLoading(true);
      await projectAPI.deleteProject(projectToDelete.id);
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete project", error);
      setError("Failed to delete project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? "bg-[#100e24]" : "bg-gray-100"} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <PageTemplate
            title="Projects"
            breadcrumbItems={breadcrumbItems}
          >
            {/* Header with search and add button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Search Input */}
                <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className={`pl-10 pr-4 py-2 rounded-lg text-sm ${
                      isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                    } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Add Project Button */}
                <Button
                  onClick={() => setShowAddProject(true)}
                  className={`${
                    isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
                  }`}
                  disabled={isLoading}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
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

            {/* Loading state */}
            {isLoading && projects.length === 0 ? (
              <div className={`flex justify-center items-center p-12 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading projects...</span>
              </div>
            ) : (
              /* Projects Table */
              <div className={`overflow-hidden rounded-lg border ${
                isDark ? "border-[#2e2c50]" : "border-gray-200"
              }`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${
                    isDark ? "bg-[#201e3d] text-gray-300" : "bg-gray-50 text-gray-600"
                  }`}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Project Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Created At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Sources
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${
                    isDark ? "bg-[#17162e] divide-[#2e2c50]" : "bg-white divide-gray-200"
                  } divide-y`}>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={5} 
                          className={`px-6 py-4 text-center text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No projects found. Create your first project with the button above.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr 
                          key={project.id} 
                          className={`cursor-pointer ${
                            isDark 
                              ? "hover:bg-[#201e3d]" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <td 
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {project.name}
                          </td>
                          <td className={`px-6 py-4 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}>
                            {project.description.length > 50 
                              ? `${project.description.substring(0, 50)}...` 
                              : project.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}>
                            {project.createdAt}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-800"
                            }`}>
                              {project.sourceCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                              }}
                              className={`${
                                isDark 
                                ? "text-blue-400 hover:bg-[#201e3d] hover:text-blue-300" 
                                : "text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                              }`}
                            >
                              <EditIcon className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {projectToDelete && (
              <DeleteConfirmationModal
                itemName={projectToDelete.name}
                itemType="Project"
                onDelete={confirmDeleteProject}
                onCancel={() => setProjectToDelete(null)}
                isDark={isDark}
              />
            )}

            {/* Add Project Card Modal */}
            {showAddProject && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <AddProjectCard
                  onAdd={addProject}
                  onCancel={() => setShowAddProject(false)}
                  isDark={isDark}
                />
              </div>
            )}

            {/* Edit Project Sheet */}
            <EditProjectSheet
              project={editProject}
              onUpdate={updateProject}
              onDelete={handleDeleteClick}
              onClose={() => setEditProject(null)}
              open={editProject !== null}
              isDark={isDark}
            />
          </PageTemplate>
        </div>
      </div>
    </div>
  );
};