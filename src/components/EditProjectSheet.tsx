import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { Project } from "../pages/Projects";
import { Sheet } from "./ui/sheet";
import { TrashIcon } from "lucide-react";

interface EditProjectSheetProps {
  project: Project | null;
  onUpdate: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClose: () => void;
  open: boolean;
  isDark: boolean;
}

export const EditProjectSheet: React.FC<EditProjectSheetProps> = ({ 
  project, 
  onUpdate, 
  onDelete,
  onClose, 
  open,
  isDark 
}) => {
  const [formData, setFormData] = useState<Project | null>(project);

  // Reset form data when project changes
  useEffect(() => {
    if (project) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setFormData(project);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setFormData(null);
    }
  }, [project]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdate(formData);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Edit Project"
      width="450px"
      isDark={isDark}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Project Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            />
          </div>

          {/* Created At - Read Only */}
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium mb-1">
              Created At
            </label>
            <input
              type="text"
              id="createdAt"
              readOnly
              value={formData.createdAt}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#17162e] border-[#2e2c50] text-gray-400" 
                : "bg-gray-100 border-gray-200 text-gray-600"
              } border focus:outline-none`}
            />
          </div>

          {/* Source Count - Read Only */}
          <div>
            <label htmlFor="sourceCount" className="block text-sm font-medium mb-1">
              Number of Sources
            </label>
            <input
              type="text"
              id="sourceCount"
              readOnly
              value={formData.sourceCount}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#17162e] border-[#2e2c50] text-gray-400" 
                : "bg-gray-100 border-gray-200 text-gray-600"
              } border focus:outline-none`}
            />
          </div>
        </div>

        {/* Button Group */}
        <div className="flex justify-between mt-6">
          {/* Delete Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => formData && onDelete(formData)}
            className={`${
              isDark 
              ? "border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300" 
              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            }`}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete Project
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={`${
                isDark 
                ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${
                isDark 
                ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
                : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              Update Project
            </Button>
          </div>
        </div>
      </form>
    </Sheet>
  );
};