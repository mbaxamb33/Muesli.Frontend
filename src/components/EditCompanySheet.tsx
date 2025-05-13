import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { Company } from "../pages/Clients";
import { Sheet } from "./ui/sheet";
import { TrashIcon } from "lucide-react";

// Industry options for dropdown
const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Media",
  "Energy",
  "Transportation",
  "Agriculture",
  "Entertainment",
  "Consulting",
  "Non-profit",
  "Other"
];

// Status options for dropdown
const statusOptions = [
  "Active",
  "Inactive",
  "Potential",
  "Onboarding",
  "Suspended"
];

interface EditCompanySheetProps {
  company: Company | null;
  onUpdate: (company: Company) => void;
  onDelete: (company: Company) => void;
  onClose: () => void;
  open: boolean;
  isDark: boolean;
}

export const EditCompanySheet: React.FC<EditCompanySheetProps> = ({ 
  company, 
  onUpdate, 
  onDelete,
  onClose, 
  open,
  isDark 
}) => {
  const [formData, setFormData] = useState<Company | null>(company);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when company changes
  useEffect(() => {
    if (company) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setFormData(company);
        setErrors({});
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setFormData(null);
    }
  }, [company]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    
    // Validate website format if provided
    if (formData.website && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(formData.website)) {
      newErrors.website = "Please enter a valid website (e.g., example.com)";
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
      await onUpdate(formData);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onDelete(formData);
    } catch (error) {
      console.error("Error initiating company delete:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title="Edit Company"
      width="450px"
      isDark={isDark}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Company Name*
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
                errors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Industry Dropdown */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-1">
              Industry*
            </label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                errors.industry 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
              disabled={isSubmitting}
            >
              <option value="" disabled>Select an industry</option>
              {industryOptions.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
            )}
          </div>

          {/* Status Dropdown */}
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
              disabled={isSubmitting}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="example.com"
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                errors.website 
                  ? "border-red-500 focus:ring-red-500" 
                  : isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
              disabled={isSubmitting}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Button Group */}
        <div className="flex justify-between mt-6">
          {/* Delete Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteClick}
            className={`${
              isDark 
              ? "border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300" 
              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            }`}
            disabled={isSubmitting}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete Company
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
                "Update Company"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Sheet>
  );
};