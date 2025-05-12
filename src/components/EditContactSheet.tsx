import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { Contact } from "./ContactsTable";
import { Sheet } from "./ui/sheet";
import { TrashIcon } from "lucide-react";

// Position options for dropdown
const positionOptions = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "Director",
  "Manager",
  "Team Lead",
  "Developer",
  "Designer",
  "Marketing Specialist",
  "Sales Representative",
  "HR Manager",
  "Consultant",
  "Assistant",
  "Other"
];

interface EditContactSheetProps {
  contact: Contact | null;
  onUpdate: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onClose: () => void;
  open: boolean;
  isDark: boolean;
}

export const EditContactSheet: React.FC<EditContactSheetProps> = ({ 
  contact, 
  onUpdate, 
  onDelete,
  onClose, 
  open,
  isDark 
}) => {
  const [formData, setFormData] = useState<Contact | null>(contact);

  // Reset form data when contact changes
  useEffect(() => {
    if (contact) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setFormData(contact);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setFormData(null);
    }
  }, [contact]);

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
      title="Edit Contact"
      width="450px"
      isDark={isDark}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Contact Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Contact Name*
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

          {/* Position Dropdown */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-1">
              Position*
            </label>
            <select
              id="position"
              name="position"
              required
              value={formData.position}
              onChange={handleChange}
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-blue-500" : "focus:ring-blue-600"
              }`}
            >
              <option value="" disabled>Select a position</option>
              {positionOptions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
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
            Delete Contact
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
              Update Contact
            </Button>
          </div>
        </div>
      </form>
    </Sheet>
  );
};