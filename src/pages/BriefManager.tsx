// src/pages/BriefManager.tsx - Manager for all briefs of a company/project
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { ArrowLeftIcon, SearchIcon, PlusIcon, Building2, FolderOpen } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { BriefCard } from "../components/BriefCard";
import { BriefTaskSection } from "../components/BriefTaskSection";
import { AddBriefCard } from "../components/AddBriefCard";
import { Brief } from "../types/brief";
import { BriefTask } from "../types/briefDetails";

// Entity info interface
interface EntityInfo {
  id: string;
  name: string;
  type: "company" | "project";
  description?: string;
  status: string;
  totalBriefs: number;
  activeBriefs: number;
  completedBriefs: number;
}

// Mock data for entity info
const mockEntityInfo: Record<string, EntityInfo> = {
  "c1": {
    id: "c1",
    name: "General Dynamics",
    type: "company",
    description: "Defense contractor with multiple strategic initiatives",
    status: "Active",
    totalBriefs: 8,
    activeBriefs: 3,
    completedBriefs: 5
  },
  "c2": {
    id: "c2", 
    name: "Northrop Grumman",
    type: "company",
    description: "Aerospace and defense technology corporation",
    status: "Active",
    totalBriefs: 5,
    activeBriefs: 2,
    completedBriefs: 3
  },
  "p1": {
    id: "p1",
    name: "Digital Transformation Initiative",
    type: "project",
    description: "Cross-company digital modernization project",
    status: "Active",
    totalBriefs: 12,
    activeBriefs: 7,
    completedBriefs: 5
  }
};

// Mock data for briefs by entity
const mockBriefsByEntity: Record<string, Brief[]> = {
  "c1": [
    {
      id: "b1",
      clientName: "General Dynamics",
      projectType: "Strategic Defense Analysis",
      progress: 75,
      status: "In Progress",
      lastUpdated: "2025-05-29T10:30:00Z",
      tags: ["Strategy", "Defense", "High Priority"],
      description: "Comprehensive strategic analysis for next-generation defense technologies",
      createdAt: "2025-05-15T09:00:00Z"
    },
    {
      id: "b2",
      clientName: "General Dynamics",
      projectType: "Market Expansion Study",
      progress: 100,
      status: "Complete",
      lastUpdated: "2025-05-28T14:45:00Z",
      tags: ["Market", "Analysis"],
      description: "Analysis of potential expansion into European defense markets",
      createdAt: "2025-05-10T11:00:00Z"
    },
    {
      id: "b3",
      clientName: "General Dynamics",
      projectType: "Technology Assessment",
      progress: 45,
      status: "In Progress",
      lastUpdated: "2025-05-27T16:20:00Z",
      tags: ["Technology", "Assessment"],
      description: "Evaluation of emerging AI technologies for defense applications",
      createdAt: "2025-05-20T13:30:00Z"
    }
  ],
  "c2": [
    {
      id: "b4",
      clientName: "Northrop Grumman",
      projectType: "Space Systems Analysis",
      progress: 90,
      status: "Review",
      lastUpdated: "2025-05-26T12:15:00Z",
      tags: ["Space", "Systems"],
      description: "Strategic analysis for next-generation space defense systems",
      createdAt: "2025-05-12T08:45:00Z"
    },
    {
      id: "b5",
      clientName: "Northrop Grumman",
      projectType: "Supply Chain Optimization",
      progress: 30,
      status: "Draft",
      lastUpdated: "2025-05-25T09:30:00Z",
      tags: ["Supply Chain", "Optimization"],
      description: "Analysis and optimization of aerospace manufacturing supply chain",
      createdAt: "2025-05-18T15:20:00Z"
    }
  ],
  "p1": [
    {
      id: "b6",
      clientName: "Digital Transformation Initiative",
      projectType: "Digital Infrastructure Assessment",
      progress: 85,
      status: "Review",
      lastUpdated: "2025-05-29T09:00:00Z",
      tags: ["Digital", "Infrastructure"],
      description: "Assessment of current digital infrastructure across all participating companies",
      createdAt: "2025-05-08T10:15:00Z"
    },
    {
      id: "b7",
      clientName: "Digital Transformation Initiative",
      projectType: "Change Management Strategy",
      progress: 60,
      status: "In Progress",
      lastUpdated: "2025-05-28T11:30:00Z",
      tags: ["Change Management", "Strategy"],
      description: "Development of comprehensive change management strategy for digital transformation",
      createdAt: "2025-05-14T12:00:00Z"
    }
  ]
};

// Mock tasks data
const mockTasks: BriefTask[] = [
  {
    id: "t1",
    title: "Stakeholder Interviews",
    status: "Complete",
    assignee: "Sarah Chen",
    dueDate: "2025-05-25T00:00:00Z",
    priority: "High",
    description: "Conduct interviews with key stakeholders"
  },
  {
    id: "t2",
    title: "Market Data Analysis",
    status: "In Progress",
    assignee: "Michael Rodriguez", 
    dueDate: "2025-06-02T00:00:00Z",
    priority: "Critical",
    description: "Analyze market trends and competitive landscape"
  },
  {
    id: "t3",
    title: "Financial Impact Assessment",
    status: "In Progress",
    assignee: "Jennifer Kim",
    dueDate: "2025-06-05T00:00:00Z",
    priority: "High",
    description: "Assess financial implications of recommendations"
  },
  {
    id: "t4",
    title: "Final Report Preparation",
    status: "Pending",
    assignee: "David Thompson",
    dueDate: "2025-06-10T00:00:00Z",
    priority: "Medium",
    description: "Prepare comprehensive final report"
  }
];

export const BriefManager = (): JSX.Element => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [tasks, setTasks] = useState<BriefTask[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddBrief, setShowAddBrief] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch entity and briefs data
  useEffect(() => {
    const fetchData = async () => {
      if (!entityId || !entityType) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const entity = mockEntityInfo[entityId];
        const entityBriefs = mockBriefsByEntity[entityId] || [];
        
        if (!entity) {
          setError("Entity not found");
          return;
        }
        
        setEntityInfo(entity);
        setBriefs(entityBriefs);
      } catch (error) {
        console.error("Error fetching entity data:", error);
        setError("Failed to load entity details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [entityId, entityType]);

  // Generate breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Briefs Management", path: "/briefs" }
    ];
    
    if (entityInfo) {
      items.push({
        label: entityInfo.name,
        path: `/briefs/${entityType}/${entityId}`
      });
    }
    
    return items;
  }, [entityInfo, entityType, entityId]);

  // Filter briefs based on search and status
  const filteredBriefs = React.useMemo(() => {
    return briefs.filter((brief) => {
      const matchesSearch = 
        brief.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || brief.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [briefs, searchTerm, statusFilter]);

  // Get unique statuses for filter
  const uniqueStatuses = React.useMemo(() => {
    return Array.from(new Set(briefs.map(brief => brief.status))).sort();
  }, [briefs]);

  // Handle brief actions
  const handleBriefClick = (briefId: string) => {
    navigate(`/briefs/details/${briefId}`);
  };

  const handleEditBrief = (brief: Brief) => {
    console.log("Edit brief:", brief);
    // TODO: Implement edit functionality
  };

  const handleArchiveBrief = (brief: Brief) => {
    setBriefs(briefs.map(b => 
      b.id === brief.id 
        ? { ...b, status: 'Archived' as const, lastUpdated: new Date().toISOString() }
        : b
    ));
  };

  // Add new brief
  const addBrief = async (briefData: Omit<Brief, "id" | "createdAt" | "lastUpdated">) => {
    try {
      const newBrief: Brief = {
        ...briefData,
        id: `b${briefs.length + 1}`,
        clientName: entityInfo?.name || briefData.clientName,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setBriefs([newBrief, ...briefs]);
      setShowAddBrief(false);
      
      // Update entity info
      if (entityInfo) {
        setEntityInfo({
          ...entityInfo,
          totalBriefs: entityInfo.totalBriefs + 1,
          activeBriefs: newBrief.status === 'In Progress' ? entityInfo.activeBriefs + 1 : entityInfo.activeBriefs
        });
      }
    } catch (error) {
      console.error("Failed to add brief", error);
      setError("Failed to add brief. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading briefs...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !entityInfo) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
            {error || "Entity not found"}
          </div>
          <Button
            onClick={() => navigate('/briefs')}
            className={`${
              isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            Back to Briefs Management
          </Button>
        </div>
      </div>
    );
  }

  const EntityIcon = entityInfo.type === 'company' ? Building2 : FolderOpen;

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Back button and page title */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/briefs')}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Briefs Management
          </Button>
        </div>

        {/* Entity Header */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-[#201e3d]' : 'bg-gray-100'
              }`}>
                <EntityIcon className={`w-6 h-6 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {entityInfo.name}
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {entityInfo.description}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  entityInfo.status === 'Active' 
                    ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                    : isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {entityInfo.status}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Brief Statistics */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {entityInfo.totalBriefs}
                  </div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Total Briefs
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {entityInfo.activeBriefs}
                  </div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {entityInfo.completedBriefs}
                  </div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <BriefTaskSection 
            tasks={tasks}
            isDark={isDark}
          />
        </div>

        {/* Briefs Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Briefs ({filteredBriefs.length})
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search briefs..."
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm w-64 ${
                    isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                  } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
              >
                <option value="all">All Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Add Brief Button */}
              <Button
                onClick={() => setShowAddBrief(true)}
                className={`${
                  isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Brief
              </Button>
            </div>
          </div>

          {/* Briefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBriefs.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                <p className="text-lg mb-2">No briefs found</p>
                <p>Create your first brief for this {entityInfo.type} with the button above.</p>
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
        </div>

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