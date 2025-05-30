// src/components/AddBriefCard.tsx
import React, { useState } from "react";
import { Button } from "./components/button";
import { Brief } from "../types/brief";
import { X } from "lucide-react";

interface AddBriefCardProps {
  onAdd: (brief: Omit<Brief, "id" | "createdAt" | "lastUpdated">) => void;
  onCancel: () => void;
  isDark: boolean;
}

// Project type options for dropdown
const projectTypeOptions = [
  "Product Expansion",
  "Market Research",
  "Brand Strategy",
  "Digital Transformation",
  "Cost Optimization",
  "Competitive Analysis",
  "New Product Launch",
  "Customer Experience",
  "Process Improvement",
  "Strategic Planning",
  "Other"
];

// Status options for dropdown
const statusOptions = [
  "Draft",
  "In Progress",
  "Review",
  "Complete"
];

// Client options (these would typically come from your companies/clients data)
const clientOptions = [
  "General Dynamics",
  "Northrop Grumman",
  "Raytheon Technologies",
  "Lockheed Martin",
  "Boeing Defense",
  "BAE Systems",
  "L3Harris Technologies",
  "CACI International",
  "SAIC",
  "Booz Allen Hamilton"
];

export const AddBriefCard: React.FC<AddBriefCardProps> = ({ onAdd, onCancel, isDark }) => {
  const [formData, setFormData] = useState<Omit<Brief, "id" | "createdAt" | "lastUpdated">>({
    clientName: "",
    projectType: "",
    progress: 0,
    status: "Draft",
    tags: [],
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'progress' ? parseInt(value) || 0 : value 
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.projectType.trim()) {
      newErrors.projectType = "Project type is required";
    }
    
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = "Progress must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onAdd(formData);
    } catch (error) {
      console.error("Error creating brief:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-xl w-full max-w-lg mx-auto ${
      isDark ? "bg-[#17162e] text-white" : "bg-white text-gray-800"
    }`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Create New Brief</h2>
        <button 
          onClick={onCancel}
          className={`p-1 rounded-full ${
            isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"
          } transition-colors duration-200`}
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Client Name */}
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium mb-1">
              Client Name*
            </label>
            <select
              id="clientName"
              name="clientName"
              required
              value={formData.clientName}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                errors.clientName 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            >
              <option value="" disabled>Select a client</option>
              {clientOptions.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
            )}
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium mb-1">
              Project Type*
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                errors.projectType 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            >
              <option value="" disabled>Select project type</option>
              {projectTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.projectType && (
              <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status*
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Progress */}
          <div>
            <label htmlFor="progress" className="block text-sm font-medium mb-1">
              Progress (%)
            </label>
            <input
              type="number"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                errors.progress 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            />
            {errors.progress && (
              <p className="mt-1 text-sm text-red-500">{errors.progress}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    isDark 
                      ? "bg-[#201e3d] text-gray-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className={`flex-1 rounded-lg px-3 py-2 ${
                  isDark 
                  ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                  : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 ${
                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                }`}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className={`${
                  isDark 
                  ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the project..."
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            />
          </div>
        </div>

        {/* Button Group */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={`${
              isDark 
              ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Brief"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};