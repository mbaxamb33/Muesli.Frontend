// src/pages/Clients.tsx (updated to connect with backend)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ClientsTable } from "../components/ClientsTable";
import { AddCompanyCard } from "../components/AddCompanyCard";
import { EditCompanySheet } from "../components/EditCompanySheet";
import { CompanyCharts } from "../components/CompanyCharts";
import { Breadcrumb } from "../components/Breadcrumb";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { companyAPI } from "../services/api";

// Company interface (keep the existing definition)
export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  address: string;
  notes: string;
  status: string;
}

export const Clients = (): JSX.Element => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom breadcrumb items for clients page
  const breadcrumbItems = React.useMemo(() => {
    return [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
  }, []);

  // Fetch companies from the backend when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await companyAPI.getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies", error);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Add a new company
  const addCompany = async (company: Omit<Company, "id">) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create company in the backend
      const newCompany = await companyAPI.createCompany(company);
      
      // Update local state with the new company
      setCompanies([...companies, newCompany]);
      
      // Hide the add company form
      setShowAddCard(false);
    } catch (error) {
      console.error("Failed to add company", error);
      setError("Failed to add company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing company
  const updateCompany = async (updatedCompany: Company) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update company in the backend
      await companyAPI.updateCompany(updatedCompany);
      
      // Update local state
      setCompanies(companies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      ));
      
      // Close the edit form
      setEditCompany(null);
    } catch (error) {
      console.error("Failed to update company", error);
      setError("Failed to update company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a company
  const deleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Delete company from the backend
      await companyAPI.deleteCompany(companyToDelete.id);
      
      // Update local state
      setCompanies(companies.filter(company => company.id !== companyToDelete.id));
      
      // Close the delete confirmation modal
      setCompanyToDelete(null);
    } catch (error) {
      console.error("Failed to delete company", error);
      setError("Failed to delete company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to company details page
  const handleCompanyClick = (companyId: string) => {
    navigate(`/clients/${companyId}`);
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? "bg-[#100e24]" : "bg-gray-100"} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Custom breadcrumb for clients page */}
        <Breadcrumb items={breadcrumbItems} />

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
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className={`rounded-lg border-l-4 p-4 mb-6 ${
            isDark 
            ? "bg-red-900/30 border-red-500 text-red-300" 
            : "bg-red-50 border-red-500 text-red-700"
          }`}>
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className={`flex justify-center items-center p-12 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading companies...</span>
          </div>
        ) : (
          <>
            {/* Clients Table */}
            <ClientsTable 
              companies={filteredCompanies} 
              isDark={isDark}
              onEditClick={(company) => setEditCompany(company)}
              onRowClick={handleCompanyClick}
            />

            {/* Company Charts */}
            {filteredCompanies.length > 0 && (
              <CompanyCharts companies={filteredCompanies} />
            )}
          </>
        )}

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

        {/* Edit Company Sheet */}
        <EditCompanySheet
          company={editCompany}
          onUpdate={updateCompany}
          onDelete={(company) => setCompanyToDelete(company)}
          onClose={() => setEditCompany(null)}
          open={editCompany !== null}
          isDark={isDark}
        />

        {/* Delete Confirmation Modal */}
        {companyToDelete && (
          <DeleteConfirmationModal
            itemName={companyToDelete.name}
            itemType="Company"
            onDelete={deleteCompany}
            onCancel={() => setCompanyToDelete(null)}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};