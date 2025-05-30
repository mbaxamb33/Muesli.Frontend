// src/pages/Briefs.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { BriefCard } from "../components/BriefCard";
import { AddBriefCard } from "../components/AddBriefCard";
import { Brief, BriefFilters } from "../types/brief";

// Mock data for briefs
const mockBriefs: Brief[] = [
  {
    id: "1",
    clientName: "General Dynamics",
    projectType: "Product Expansion",
    progress: 60,
    status: "In Progress",
    lastUpdated: "2025-05-29T10:30:00Z",
    tags: ["Ack", "High Priority"],
    description: "Strategic analysis for expanding into new defense markets",
    createdAt: "2025-05-15T09:00:00Z"
  },
  {
    id: "2",
    clientName: "Northrop Grumman",
    projectType: "Market Research",
    progress: 100,
    status: "Complete",
    lastUpdated: "2025-05-28T14:45:00Z",
    tags: ["Research", "Complete"],
    description: "Comprehensive market analysis for space defense sector",
    createdAt: "2025-05-10T11:00:00Z"
  },
  {
    id: "3",
    clientName: "Raytheon Technologies",
    projectType: "Brand Strategy",
    progress: 25,
    status: "Draft",
    lastUpdated: "2025-05-27T16:20:00Z",
    tags: ["Marketing", "Strategy"],
    description: "Rebranding initiative for next-generation radar systems",
    createdAt: "2025-05-20T13:30:00Z"
  },
  {
    id: "4",
    clientName: "Lockheed Martin",
    projectType: "Digital Transformation",
    progress: 85,
    status: "Review",
    lastUpdated: "2025-05-26T12:15:00Z",
    tags: ["Digital", "Transformation"],
    description: "Digital modernization roadmap for manufacturing processes",
    createdAt: "2025-05-12T08:45:00Z"
  },
  {
    id: "5",
    clientName: "Boeing Defense",
    projectType: "Cost Optimization",
    progress: 45,
    status: "In Progress",
    lastUpdated: "2025-05-25T09:30:00Z",
    tags: ["Cost", "Efficiency"],
    description: "Supply chain optimization for military aircraft production",
    createdAt: "2025-05-18T15:20:00Z"
  },
  {
    id: "6",
    clientName: "BAE Systems",
    projectType: "Competitive Analysis",
    progress: 90,
    status: "Review",
    lastUpdated: "2025-05-24T11:45:00Z",
    tags: ["Analysis", "Intelligence"],
    description: "Competitive landscape assessment for naval systems",
    createdAt: "2025-05-08T10:15:00Z"
  },
  {
    id: "7",
    clientName: "L3Harris Technologies",
    projectType: "New Product Launch",
    progress: 15,
    status: "Draft",
    lastUpdated: "2025-05-23T14:30:00Z",
    tags: ["Launch", "Product"],
    description: "Go-to-market strategy for advanced communication systems",
    createdAt: "2025-05-22T12:00:00Z"
  },
  {
    id: "8",
    clientName: "CACI International",
    projectType: "Customer Experience",
    progress: 70,
    status: "In Progress",
    lastUpdated: "2025-05-22T16:00:00Z",
    tags: ["CX", "Service"],
    description: "Customer journey optimization for government services",
    createdAt: "2025-05-14T09:30:00Z"
  }
];

export const Briefs = (): JSX.Element => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [briefs, setBriefs] = useState<Brief[]>(mockBriefs);
  const [showAddBrief, setShowAddBrief] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<BriefFilters>({
    client: "",
    status: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom breadcrumb items for briefs page
  const breadcrumbItems = React.useMemo(() => {
    return [
      { label: "Home", path: "/" },
      { label: "Briefs", path: "/briefs" }
    ];
  }, []);

  // Get unique clients and statuses for filters
  const uniqueClients = React.useMemo(() => {
    return Array.from(new Set(briefs.map(brief => brief.clientName))).sort();
  }, [briefs]);

  const uniqueStatuses = React.useMemo(() => {
    return Array.from(new Set(briefs.map(brief => brief.status))).sort();
  }, [briefs]);

  // Filter briefs based on search term and filters
  const filteredBriefs = React.useMemo(() => {
    return briefs.filter((brief) => {
      const matchesSearch = 
        brief.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesClient = !filters.client || brief.clientName === filters.client;
      const matchesStatus = !filters.status || brief.status === filters.status;
      
      return matchesSearch && matchesClient && matchesStatus;
    });
  }, [briefs, searchTerm, filters]);

  // Add new brief
  const addBrief = async (briefData: Omit<Brief, "id" | "createdAt" | "lastUpdated">) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newBrief: Brief = {
        ...briefData,
        id: (briefs.length + 1).toString(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setBriefs([newBrief, ...briefs]);
      setShowAddBrief(false);
    } catch (error) {
      console.error("Failed to add brief", error);
      setError("Failed to add brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle brief click - navigate to brief details
  const handleBriefClick = (briefId: string) => {
    navigate(`/briefs/${briefId}`);
  };

  // Handle edit brief
  const handleEditBrief = (brief: Brief) => {
    console.log("Edit brief:", brief);
    // TODO: Implement edit functionality
  };

  // Handle archive brief
  const handleArchiveBrief = (brief: Brief) => {
    setBriefs(briefs.map(b => 
      b.id === brief.id 
        ? { ...b, status: 'Archived' as const, lastUpdated: new Date().toISOString() }
        : b
    ));
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof BriefFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className={`${isDark ? "bg-[#100e24]" : "bg-gray-100"} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header with title, search, filters, and add button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Briefs
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search briefs..."
                className={`pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64 ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Client Filter */}
            <select
              value={filters.client}
              onChange={(e) => handleFilterChange('client', e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${
                isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
              } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
            >
              <option value="">All Clients</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${
                isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
              } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
            >
              <option value="">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Add Brief Button */}
            <Button
              onClick={() => setShowAddBrief(true)}
              className={`${
                isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
              } whitespace-nowrap`}
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Brief
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
            <span>Loading briefs...</span>
          </div>
        ) : (
          /* Briefs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredBriefs.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                <p className="text-lg mb-2">No briefs found</p>
                <p>Create your first brief with the button above.</p>
              </div>
            ) : (
              filteredBriefs.map((brief) => (
                <BriefCard
                  key={brief.id}
                  brief={brief}
                  isDark={isDark}
                  onEdit={handleEditBrief}
                  onArchive={handleArchiveBrief}
                  onClick={handleBriefClick}
                />
              ))
            )}
          </div>
        )}

        {/* Add Brief Modal */}
        {showAddBrief && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <AddBriefCard
              onAdd={addBrief}
              onCancel={() => setShowAddBrief(false)}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
};