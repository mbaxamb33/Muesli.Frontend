// src/pages/BriefDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { ArrowLeftIcon, SearchIcon, DownloadIcon, Plus } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { BriefCard } from "../components/BriefCard";
import { BriefTaskSection } from "../components/BriefTaskSection";
import { BriefProcess, Brief, BriefTask } from "../types/briefDetails";

// Mock data for brief process
const mockBriefProcess: BriefProcess = {
  id: "1",
  title: "General Dynamics Strategic Defense Initiative",
  description: "Comprehensive strategic analysis and expansion planning for General Dynamics' next-generation defense technologies and market positioning.",
  tags: ["Strategy", "Defense", "Market Analysis", "High Priority"],
  progress: 65,
  status: "In Progress",
  clientName: "General Dynamics",
  projectType: "Strategic Planning",
  createdAt: "2025-05-10T09:00:00Z",
  lastUpdated: "2025-05-29T14:30:00Z",
  tasks: [
    {
      id: "t1",
      title: "Market Research & Competitive Analysis",
      status: "Complete",
      assignee: "Sarah Chen",
      dueDate: "2025-05-25T00:00:00Z",
      priority: "High",
      description: "Analyze current market trends and competitor positioning"
    },
    {
      id: "t2",
      title: "Technology Assessment Report",
      status: "In Progress",
      assignee: "Michael Rodriguez",
      dueDate: "2025-06-02T00:00:00Z",
      priority: "Critical",
      description: "Evaluate emerging technologies and their strategic implications"
    },
    {
      id: "t3",
      title: "Financial Impact Analysis",
      status: "In Progress",
      assignee: "Jennifer Kim",
      dueDate: "2025-06-05T00:00:00Z",
      priority: "High",
      description: "Assess financial implications of strategic recommendations"
    },
    {
      id: "t4",
      title: "Stakeholder Presentation Prep",
      status: "Pending",
      assignee: "David Thompson",
      dueDate: "2025-06-10T00:00:00Z",
      priority: "Medium",
      description: "Prepare executive presentation materials"
    },
    {
      id: "t5",
      title: "Risk Assessment Framework",
      status: "Blocked",
      assignee: "Lisa Park",
      dueDate: "2025-06-08T00:00:00Z",
      priority: "Critical",
      description: "Develop comprehensive risk assessment methodology"
    }
  ],
  relatedBriefs: [
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
      clientName: "General Dynamics",
      projectType: "Technology Assessment",
      progress: 85,
      status: "Review",
      lastUpdated: "2025-05-28T14:45:00Z",
      tags: ["Technology", "Review"],
      description: "Assessment of emerging defense technologies",
      createdAt: "2025-05-12T11:00:00Z"
    },
    {
      id: "3",
      clientName: "General Dynamics",
      projectType: "Market Analysis",
      progress: 40,
      status: "In Progress",
      lastUpdated: "2025-05-27T16:20:00Z",
      tags: ["Market", "Analysis"],
      description: "Comprehensive market positioning analysis",
      createdAt: "2025-05-18T13:30:00Z"
    },
    {
      id: "4",
      clientName: "General Dynamics",
      projectType: "Financial Planning",
      progress: 25,
      status: "Draft",
      lastUpdated: "2025-05-26T12:15:00Z",
      tags: ["Finance", "Planning"],
      description: "Strategic financial planning and forecasting",
      createdAt: "2025-05-20T08:45:00Z"
    }
  ]
};

export const BriefDetails = (): JSX.Element => {
  const { briefId } = useParams<{ briefId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [briefProcess, setBriefProcess] = useState<BriefProcess | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brief process data
  useEffect(() => {
    const fetchBriefProcess = async () => {
      if (!briefId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setBriefProcess(mockBriefProcess);
      } catch (error) {
        console.error("Error fetching brief process:", error);
        setError("Failed to load brief details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBriefProcess();
  }, [briefId]);

  // Generate breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Briefs", path: "/briefs" }
    ];
    
    if (briefProcess) {
      items.push({
        label: briefProcess.title,
        path: `/briefs/${briefId}`
      });
    }
    
    return items;
  }, [briefProcess, briefId]);

  // Filter related briefs based on search
  const filteredBriefs = React.useMemo(() => {
    if (!briefProcess) return [];
    
    return briefProcess.relatedBriefs.filter((brief) =>
      brief.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [briefProcess, searchTerm]);

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (progress >= 50) return isDark ? 'bg-blue-500' : 'bg-blue-600';
    if (progress >= 25) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    return isDark ? 'bg-red-500' : 'bg-red-600';
  };

  // Handle export
  const handleExport = () => {
    console.log("Exporting brief process data...");
    // TODO: Implement export functionality
  };

  // Handle brief actions
  const handleEditBrief = (brief: Brief) => {
    console.log("Edit brief:", brief);
    // TODO: Implement edit functionality
  };

  const handleArchiveBrief = (brief: Brief) => {
    console.log("Archive brief:", brief);
    // TODO: Implement archive functionality
  };

  const handleBriefClick = (briefId: string) => {
    navigate(`/briefs/${briefId}`);
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
            Loading brief details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !briefProcess) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
            {error || "Brief not found"}
          </div>
          <Button
            onClick={() => navigate('/briefs')}
            className={`${
              isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            Back to Briefs
          </Button>
        </div>
      </div>
    );
  }

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
            Back to Briefs
          </Button>
        </div>

        {/* Brief Process Header */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {briefProcess.title}
              </h1>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {briefProcess.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {briefProcess.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDark 
                        ? "bg-[#201e3d] text-gray-300" 
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className={`${
                  isDark 
                  ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Overall Progress
              </span>
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                {briefProcess.progress}% complete
              </span>
            </div>
            <div className={`w-full h-3 rounded-full ${
              isDark ? "bg-[#2e2c50]" : "bg-gray-200"
            }`}>
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  getProgressColor(briefProcess.progress)
                }`}
                style={{ width: `${briefProcess.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <BriefTaskSection 
            tasks={briefProcess.tasks}
            isDark={isDark}
          />
        </div>

        {/* Related Briefs Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Related Briefs ({filteredBriefs.length})
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search related briefs..."
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm w-64 ${
                    isDark ? "bg-[#201e3d] text-white" : "bg-white text-gray-800"
                  } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Briefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBriefs.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                <p className="text-lg mb-2">No related briefs found</p>
                <p>Try adjusting your search criteria.</p>
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
      </div>
    </div>
  );
};