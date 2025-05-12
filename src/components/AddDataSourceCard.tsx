import React, { useState, useRef } from "react";
import { Button } from "./components/button";
import { DataSource } from "./DataSourcesTable";
import { X, Upload, FileIcon, FileTextIcon, FileSpreadsheetIcon, FileAudioIcon, GlobeIcon } from "lucide-react";

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

// Map file types to their corresponding icons
const typeIcons = {
  website: <GlobeIcon className="w-4 h-4" />,
  audio: <FileAudioIcon className="w-4 h-4" />,
  word: <FileTextIcon className="w-4 h-4" />,
  pdf: <FileTextIcon className="w-4 h-4" />,
  excel: <FileSpreadsheetIcon className="w-4 h-4" />,
  txt: <FileIcon className="w-4 h-4" />
};

export const AddDataSourceCard: React.FC<AddDataSourceCardProps> = ({ onAdd, onCancel, isDark }) => {
  const [formData, setFormData] = useState<Omit<DataSource, "id">>({
    name: "",
    type: "website",
    status: "Not extracted",
    link: "",
    filename: ""
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset file and filename when type changes
    if (name === "type") {
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, filename: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, filename: file.name }));
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {typeIcons[formData.type as keyof typeof typeIcons]}
              </div>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className={`w-full rounded-lg pl-10 pr-3 py-2 ${
                  isDark 
                  ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                  : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 ${
                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                } appearance-none`}
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.55-.24L6.2 13.26a.75.75 0 111.1-1.02L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dynamic fields based on type */}
          {formData.type === 'website' ? (
            <div>
              <label htmlFor="link" className="block text-sm font-medium mb-1">
                Website URL*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <GlobeIcon className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  id="link"
                  name="link"
                  required
                  value={formData.link || ""}
                  onChange={handleChange}
                  placeholder="example.com"
                  className={`w-full rounded-lg pl-10 pr-3 py-2 ${
                    isDark 
                    ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                  } border focus:outline-none focus:ring-2 ${
                    isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
                  }`}
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="file" className="block text-sm font-medium mb-1">
                Upload File*
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                accept={
                  formData.type === 'audio' ? 'audio/*' :
                  formData.type === 'word' ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                  formData.type === 'pdf' ? 'application/pdf' :
                  formData.type === 'excel' ? '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                  formData.type === 'txt' ? 'text/plain' : ''
                }
              />
              <div className={`border-2 border-dashed rounded-lg p-4 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] hover:border-gray-500" 
                : "bg-white border-gray-300 hover:border-gray-400"
              } transition-all duration-200`}>
                <div className="flex flex-col items-center justify-center space-y-2">
                  {selectedFile ? (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-10 mb-2">
                        {typeIcons[formData.type as keyof typeof typeIcons]}
                      </div>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {selectedFile.name}
                      </p>
                      <p className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className={`mt-2 text-xs py-1 px-3 ${
                          isDark 
                          ? "border-[#2e2c50] text-gray-300 hover:bg-[#201e3d]" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Change File
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className={`p-3 rounded-full ${
                        isDark ? "bg-[#2e2c50]" : "bg-gray-100"
                      }`}>
                        <Upload className={`w-5 h-5 ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`} />
                      </div>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}>
                        Drag and drop or click to upload
                      </p>
                      <p className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {formData.type === 'audio' ? 'MP3, WAV, or OGG' :
                         formData.type === 'word' ? 'DOC or DOCX' :
                         formData.type === 'pdf' ? 'PDF' :
                         formData.type === 'excel' ? 'XLS or XLSX' :
                         'TXT files'}
                      </p>
                      <Button
                        type="button"
                        onClick={triggerFileInput}
                        className={`mt-2 ${
                          isDark 
                          ? "bg-[#201e3d] text-white hover:bg-[#2e2c50]" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>
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