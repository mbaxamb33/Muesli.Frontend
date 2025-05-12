import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { EditIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import { DeleteModuleConfirmationModal } from "./DeleteModuleConfirmationModal";

// CSS styles for smooth transitions
const styles = {
  editorRow: {
    transition: "max-height 0.3s ease-in-out",
  },
  expanded: {
    maxHeight: "800px", // Large enough to fit content
  },
  collapsed: {
    maxHeight: "0px",
    borderTop: "none",
  },
  editorContent: {
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
    opacity: 1,
    transform: "translateY(0)",
  },
  hidden: {
    opacity: 0,
    transform: "translateY(-10px)",
  }
};

// Define the Module type
export interface Module {
  id: string;
  title: string;
  content: string;
  mainIdea: string;
  crawledAt: string;
}

interface ModulesSectionProps {
  modules: Module[];
  isDark: boolean;
  onUpdateModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ 
  modules, 
  isDark, 
  onUpdateModule,
  onDeleteModule
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [editorVisible, setEditorVisible] = useState<boolean>(false);
  const [animatingClosed, setAnimatingClosed] = useState<boolean>(false);

  // Handle smooth transitions when expanding/collapsing
  useEffect(() => {
    if (expandedModuleId) {
      // Small delay to ensure the expansion animation starts after the editor is in the DOM
      const timer = setTimeout(() => {
        setEditorVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } 
  }, [expandedModuleId]);

  const handleEditClick = (module: Module) => {
    // If this module is already expanded, close it
    if (expandedModuleId === module.id) {
      closeEditor();
      return;
    }

    // If another module is already open, close it first
    if (expandedModuleId) {
      closeEditor();
      // Wait for the closing animation to finish
      setTimeout(() => {
        setEditingModule({...module});
        setExpandedModuleId(module.id);
      }, 300);
    } else {
      // No module is open, just open this one
      setEditingModule({...module});
      setExpandedModuleId(module.id);
    }
  };

  const closeEditor = () => {
    // Start fade-out animation
    setEditorVisible(false);
    setAnimatingClosed(true);
    
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setEditingModule(null);
      setExpandedModuleId(null);
      setAnimatingClosed(false);
    }, 300);
  };

  const handleCancelEdit = () => {
    closeEditor();
  };

  const handleSaveEdit = () => {
    if (editingModule) {
      // Start fade-out animation
      setEditorVisible(false);
      setAnimatingClosed(true);
      
      // Wait for animation to complete before updating
      setTimeout(() => {
        onUpdateModule(editingModule);
        setEditingModule(null);
        setExpandedModuleId(null);
        setAnimatingClosed(false);
      }, 300);
    }
  };

  const handleDeleteClick = (module: Module) => {
    setModuleToDelete(module);
  };

  const confirmDeleteModule = () => {
    if (moduleToDelete) {
      onDeleteModule(moduleToDelete.id);
      setModuleToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingModule) return;
    
    const { name, value } = e.target;
    setEditingModule({
      ...editingModule,
      [name]: value
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Modules
        </h2>
      </div>

      <div className={`overflow-hidden rounded-lg border ${
        isDark ? "border-[#2e2c50]" : "border-gray-200"
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${
            isDark ? "bg-[#201e3d] text-gray-300" : "bg-gray-50 text-gray-600"
          }`}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Main Idea
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Crawled At
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`${
            isDark ? "bg-[#17162e] divide-[#2e2c50]" : "bg-white divide-gray-200"
          } divide-y`}>
            {modules.length === 0 ? (
              <tr>
                <td 
                  colSpan={4} 
                  className={`px-6 py-4 text-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No modules found for this data source.
                </td>
              </tr>
            ) : (
              modules.map((module) => (
                <React.Fragment key={module.id}>
                  <tr className={isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"}>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {module.title}
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {module.mainIdea.length > 50 
                        ? `${module.mainIdea.substring(0, 50)}...` 
                        : module.mainIdea}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {module.crawledAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(module)}
                          className={`${
                            isDark 
                            ? expandedModuleId === module.id
                              ? "bg-[#201e3d] text-blue-300" 
                              : "text-blue-400 hover:bg-[#201e3d] hover:text-blue-300"
                            : expandedModuleId === module.id
                              ? "bg-gray-100 text-blue-800"
                              : "text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                          }`}
                        >
                          <EditIcon className="w-4 h-4 mr-1" />
                          {expandedModuleId === module.id ? "Close" : "Edit"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(module)}
                          className={`${
                            isDark 
                            ? "text-red-400 hover:bg-[#201e3d] hover:text-red-300" 
                            : "text-red-600 hover:bg-gray-100 hover:text-red-800"
                          }`}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {/* Editor Row */}
                  <tr 
                    className={`${isDark ? "bg-[#201e3d]" : "bg-gray-50"}`}
                    style={{
                      ...styles.editorRow,
                      maxHeight: (expandedModuleId === module.id && !animatingClosed) ? '800px' : '0',
                      opacity: (expandedModuleId === module.id && !animatingClosed) ? 1 : 0,
                      // Only display when this module is expanded or currently animating closed
                      display: (expandedModuleId === module.id || (animatingClosed && editingModule?.id === module.id)) ? 'table-row' : 'none',
                      borderTop: (expandedModuleId === module.id) ? `1px solid ${isDark ? '#2e2c50' : '#e5e7eb'}` : 'none',
                    }}
                  >
                    <td colSpan={4} className="px-0 overflow-hidden">
                      <div 
                        className="px-6 py-0"
                        style={{
                          ...styles.editorContent,
                          opacity: editorVisible ? 1 : 0,
                          transform: editorVisible ? 'translateY(0)' : 'translateY(-10px)'
                        }}
                      >
                        {editingModule && module.id === editingModule.id && (
                          <div className="space-y-4 py-4">
                            <div>
                              <label htmlFor="title" className={`block text-sm font-medium mb-1 ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Title
                              </label>
                              <input
                                type="text"
                                id="title"
                                name="title"
                                value={editingModule.title}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg px-3 py-2 ${
                                  isDark 
                                  ? "bg-[#17162e] border-[#2e2c50] text-white" 
                                  : "bg-white border-gray-300 text-gray-900"
                                } border focus:outline-none focus:ring-2 ${
                                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                                }`}
                              />
                            </div>
                            <div>
                              <label htmlFor="content" className={`block text-sm font-medium mb-1 ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Content
                              </label>
                              <textarea
                                id="content"
                                name="content"
                                value={editingModule.content}
                                onChange={handleInputChange}
                                rows={5}
                                className={`w-full rounded-lg px-3 py-2 ${
                                  isDark 
                                  ? "bg-[#17162e] border-[#2e2c50] text-white" 
                                  : "bg-white border-gray-300 text-gray-900"
                                } border focus:outline-none focus:ring-2 ${
                                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                                }`}
                              />
                            </div>
                            <div>
                              <label htmlFor="mainIdea" className={`block text-sm font-medium mb-1 ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Main Idea
                              </label>
                              <textarea
                                id="mainIdea"
                                name="mainIdea"
                                value={editingModule.mainIdea}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full rounded-lg px-3 py-2 ${
                                  isDark 
                                  ? "bg-[#17162e] border-[#2e2c50] text-white" 
                                  : "bg-white border-gray-300 text-gray-900"
                                } border focus:outline-none focus:ring-2 ${
                                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className={`${
                                  isDark 
                                  ? "border-[#2e2c50] text-white hover:bg-[#17162e]" 
                                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <XIcon className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleSaveEdit}
                                className={`${
                                  isDark 
                                  ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
                                  : "bg-blue-700 hover:bg-blue-800 text-white"
                                }`}
                              >
                                <CheckIcon className="w-4 h-4 mr-1" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Delete Module Confirmation Modal */}
      {moduleToDelete && (
        <DeleteModuleConfirmationModal
          moduleName={moduleToDelete.title}
          onDelete={confirmDeleteModule}
          onCancel={() => setModuleToDelete(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
};