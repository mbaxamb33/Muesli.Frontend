import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { DataSource } from "./DataSourcesTable";
import { Sheet } from "./ui/sheet";

// Data source type options for dropdown
const typeOptions = [
  "website",
  "audio",
  "word",
  "pdf",
  "excel",
  "txt"
];

// Status options
const statusOptions = [
  "Not extracted",
  "In queue",
  "Extracting",
  "Processed"
];

interface EditDataSourceSheetProps {
  dataSource: DataSource | null;
  onUpdate: (dataSource: DataSource) => void;
  onClose: () => void;
  open: boolean;
  isDark: boolean;
}

export const EditDataSourceSheet: React.FC<EditDataSourceSheetProps> = ({ 
  dataSource, 
  onUpdate, 
  onClose, 
  open,
  isDark 
}) => {
  const [formData, setFormData] = useState<DataSource | null>(dataSource);

  // Reset form data when dataSource changes
  useEffect(() => {
    if (dataSource) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setFormData(dataSource);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setFormData(null);
    }
  }, [dataSource]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      title="Edit Data Source"
      width="450px"
      isDark={isDark}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Data Source Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Data Source Name*
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

          {/* Type Dropdown */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type*
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
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
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Dynamic fields based on type */}
          {formData.type === 'website' ? (
            <div>
              <label htmlFor="link" className="block text-sm font-medium mb-1">
                Website URL*
              </label>
              <input
                type="text"
                id="link"
                name="link"
                required
                value={formData.link || ""}
                onChange={handleChange}
                placeholder="example.com"
                className={`w-full rounded-lg px-3 py-2 ${
                  isDark 
                  ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                  : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 ${
                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                }`}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="filename" className="block text-sm font-medium mb-1">
                Filename*
              </label>
              <input
                type="text"
                id="filename"
                name="filename"
                required
                value={formData.filename || ""}
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
          )}
        </div>

        {/* Button Group */}
        <div className="flex justify-end gap-3 mt-6">
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
            Update Data Source
          </Button>
        </div>
      </form>
    </Sheet>
  );
};