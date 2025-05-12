// Updated src/components/ContactsTable.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "./components/button";

// Define the Contact type
export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  isDark: boolean;
  onEditClick: (contact: Contact) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  isDark, 
  onEditClick
}) => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  const handleRowClick = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };

  return (
    <div className={`overflow-hidden rounded-lg border ${
      isDark ? "border-[#2e2c50]" : "border-gray-200"
    }`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={`${
          isDark ? "bg-[#201e3d] text-gray-300" : "bg-gray-50 text-gray-600"
        }`}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Phone
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Notes
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`${
          isDark ? "bg-[#17162e] divide-[#2e2c50]" : "bg-white divide-gray-200"
        } divide-y`}>
          {contacts.length === 0 ? (
            <tr>
              <td 
                colSpan={6} 
                className={`px-6 py-4 text-center text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No contacts found. Add your first contact with the button above.
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr 
                key={contact.id} 
                className={`cursor-pointer ${isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"}`}
                onClick={() => handleRowClick(contact.id)}
              >
                <td 
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {contact.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {contact.position}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  <a 
                    href={`mailto:${contact.email}`}
                    className={`flex items-center ${
                      isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MailIcon className="w-3.5 h-3.5 mr-1.5" />
                    {contact.email}
                  </a>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  <a 
                    href={`tel:${contact.phone}`}
                    className={`flex items-center ${
                      isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PhoneIcon className="w-3.5 h-3.5 mr-1.5" />
                    {contact.phone}
                  </a>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  {contact.notes.length > 30 
                    ? `${contact.notes.substring(0, 30)}...` 
                    : contact.notes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(contact);
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
  );
};