import React, { useState } from "react";
import { Button } from "./components/button";
import { DataSource } from "./DataSourcesTable";
import { X } from "lucide-react";

interface AddDataSourceCardProps {
  onAdd: (dataSource: Omit<DataSource, "id">) => void;
  onCancel: () => void;
  isDark: boolean;
}

// Data source type options for dropdown
const typeOptions = [
  "website",
  "audio",
  "word",
  "pdf",
  "excel",
  "txt"
];

export const AddDataSourceCard: React.FC<AddDataSourceCardProps> = ({ onAdd, onCancel, isDark }) => {
  const [formData, setFormData] = useState<Omit<DataSource, "id">>({
    name: "",
    type: "website",
    status: "Not extracted",
    link: "",
    filename: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className={`rounded-lg shadow-xl w-full max-w-lg mx-auto ${
      isDark ? "bg-[#17162e] text-white" : "bg-white text-gray-800"
    }`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Add New Data Source</h2>
        <button 
          onClick={onCancel}
          className={`p-1 rounded-full ${
            isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"
          } transition-colors duration-200`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

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
                value={formData.link}
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
                value={formData.filename}
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

          {/* Status is set to "Not extracted" by default, no need for a field */}
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
            Add Data Source
          </Button>
        </div>
      </form>
    </div>
  );
};

// Make sure the component is the default export as well
export default AddDataSourceCard;