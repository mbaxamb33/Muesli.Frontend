import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ClientsTable } from "../components/ClientsTable";
import { AddCompanyCard } from "../components/AddCompanyCard";

// Sample company data
export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  address: string;
  notes: string;
}

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Innovations Inc",
    industry: "Technology",
    website: "techinnovations.com",
    address: "123 Tech Avenue, Silicon Valley, CA",
    notes: "Leading AI solutions provider",
  },
  {
    id: "2",
    name: "Green Energy Solutions",
    industry: "Energy",
    website: "greenenergysolutions.com",
    address: "456 Renewable Road, Portland, OR",
    notes: "Focused on sustainable energy solutions",
  },
  {
    id: "3",
    name: "Global Finance Group",
    industry: "Finance",
    website: "globalfinance.com",
    address: "789 Wall Street, New York, NY",
    notes: "International investment banking",
  },
];

export const Clients = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [showAddCard, setShowAddCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const addCompany = (company: Omit<Company, "id">) => {
    const newCompany = {
      ...company,
      id: Math.random().toString(36).substring(2, 9),
    };
    setCompanies([...companies, newCompany]);
    setShowAddCard(false);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? "bg-[#100e24]" : "bg-gray-100"} flex-1 h-screen p-6 transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with search and add button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Clients
          </h1>

          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                className={`pl-10 pr-4 py-2 rounded-lg text-sm ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Client Button */}
            <Button
              onClick={() => setShowAddCard(true)}
              className={`${
                isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90" : "bg-blue-700 hover:bg-blue-800"
              } text-white`}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Clients Table */}
        <ClientsTable companies={filteredCompanies} isDark={isDark} />

        {/* Add Company Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <AddCompanyCard
              onAdd={addCompany}
              onCancel={() => setShowAddCard(false)}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
};