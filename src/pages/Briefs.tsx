// src/pages/Briefs.tsx - Updated to Briefs Management Directory
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { SearchIcon, Building2, FolderOpen, FileText } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";

// Company/Project Brief Summary interface
interface BriefEntity {
  id: string;
  name: string; // Company or Project name
  type: "company" | "project";
  briefCount: number;
  activeBriefs: number;
  completedBriefs: number;
  lastActivity: string;
  status: "Active" | "On Hold" | "Completed";
  description?: string;
}

// Mock data for brief entities (companies/projects with their brief summaries)
const mockBriefEntities: BriefEntity[] = [
  {
    id: "c1",
    name: "General Dynamics",
    type: "company",
    briefCount: 8,
    activeBriefs: 3,
    completedBriefs: 5,
    lastActivity: "2025-05-29T10:30:00Z",
    status: "Active",
    description: "Defense contractor with multiple strategic initiatives"
  },
  {
    id: "c2", 
    name: "Northrop Grumman",
    type: "company",
    briefCount: 5,
    activeBriefs: 2,
    completedBriefs: 3,
    lastActivity: "2025-05-28T14:45:00Z",
    status: "Active",
    description: "Aerospace and defense technology corporation"
  },
  {
    id: "c3",
    name: "Raytheon Technologies", 
    type: "company",
    briefCount: 6,
    activeBriefs: 4,
    completedBriefs: 2,
    lastActivity: "2025-05-27T16:20:00Z",
    status: "Active",
    description: "Aerospace and defense conglomerate"
  },
  {
    id: "c4",
    name: "Lockheed Martin",
    type: "company", 
    briefCount: 3,
    activeBriefs: 1,
    completedBriefs: 2,
    lastActivity: "2025-05-26T12:15:00Z",
    status: "On Hold",
    description: "Global aerospace, arms, defense, and technology corporation"
  },
  {
    id: "p1",
    name: "Digital Transformation Initiative",
    type: "project",
    briefCount: 12,
    activeBriefs: 7,
    completedBriefs: 5,
    lastActivity: "2025-05-29T09:00:00Z", 
    status: "Active",
    description: "Cross-company digital modernization project"
  },
  {
    id: "p2",
    name: "Market Research 2025",
    type: "project",
    briefCount: 4,
    activeBriefs: 2,
    completedBriefs: 2,
    lastActivity: "2025-05-25T11:30:00Z",
    status: "Active",
    description: "Annual market analysis and competitive intelligence"
  }
];

// Entity Card Component
interface EntityCardProps {
  entity: BriefEntity;
  isDark: boolean;
  onClick: (entityId: string) => void;
}

const EntityCard: React.FC<EntityCardProps> = ({ entity, isDark, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'On Hold': return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Completed': return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
      default: return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const EntityIcon = entity.type === 'company' ? Building2 : FolderOpen;

  return (
    <div 
      className={`rounded-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isDark 
          ? "bg-[#17162e] border-[#2e2c50] hover:border-[#3e3c60]" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onClick(entity.id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-[#201e3d]' : 'bg-gray-100'
          }`}>
            <EntityIcon className={`w-5 h-5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {entity.name}
            </h3>
            <p className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              {entity.description}
            </p>
          </div>
        </div>
        
        {/* Status Tag */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getStatusColor(entity.status)
        }`}>
          {entity.status}
        </span>
      </div>

      {/* Brief Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {entity.briefCount}
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Total Briefs
          </div>
        </div>
        
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {entity.activeBriefs}
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Active
          </div>
        </div>
        
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            {entity.completedBriefs}
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Completed
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500">
          <FileText className="w-4 h-4 mr-1" />
          <span>Last activity {formatDate(entity.lastActivity)}</span>
        </div>
        
        <div className={`text-sm font-medium ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          View Briefs →
        </div>
      </div>
    </div>
  );
};

export const Briefs = (): JSX.Element => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [entities, setEntities] = useState<BriefEntity[]>(mockBriefEntities);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "company" | "project">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "On Hold" | "Completed">("all");
  const [isLoading, setIsLoading] = useState(false);

  // Custom breadcrumb items for briefs management page
  const breadcrumbItems = React.useMemo(() => {
    return [
      { label: "Home", path: "/" },
      { label: "Briefs Management", path: "/briefs" }
    ];
  }, []);

  // Filter entities based on search term and filters
  const filteredEntities = React.useMemo(() => {
    return entities.filter((entity) => {
      const matchesSearch = 
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || entity.type === typeFilter;
      const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [entities, searchTerm, typeFilter, statusFilter]);

  // Handle entity click - navigate to entity brief manager
  const handleEntityClick = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      if (entity.type === "company") {
        navigate(`/briefs/company/${entityId}`);
      } else {
        navigate(`/briefs/project/${entityId}`);
      }
    }
  };

  return (
    <div className={`${isDark ? "bg-[#100e24]" : "bg-gray-100"} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header with title, search, and filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"} mb-2`}>
              Briefs Management Directory
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Organize and manage briefs by company and project
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search entities..."
                className={`pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64 ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className={`px-3 py-2 rounded-lg text-sm ${
                isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
              } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
            >
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="project">Projects</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`px-3 py-2 rounded-lg text-sm ${
                isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
              } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg border p-4 ${
            isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
          }`}>
            <div className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {entities.length}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Entities
            </div>
          </div>
          
          <div className={`rounded-lg border p-4 ${
            isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
          }`}>
            <div className={`text-2xl font-bold ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {entities.reduce((sum, entity) => sum + entity.briefCount, 0)}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Briefs
            </div>
          </div>
          
          <div className={`rounded-lg border p-4 ${
            isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
          }`}>
            <div className={`text-2xl font-bold ${
              isDark ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {entities.reduce((sum, entity) => sum + entity.activeBriefs, 0)}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Active Briefs
            </div>
          </div>
          
          <div className={`rounded-lg border p-4 ${
            isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
          }`}>
            <div className={`text-2xl font-bold ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>
              {entities.reduce((sum, entity) => sum + entity.completedBriefs, 0)}
            </div>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completed Briefs
            </div>
          </div>
        </div>

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
            <span>Loading brief entities...</span>
          </div>
        ) : (
          /* Entity Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredEntities.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                <p className="text-lg mb-2">No entities found</p>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              filteredEntities.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  isDark={isDark}
                  onClick={handleEntityClick}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};