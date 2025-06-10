// src/pages/BriefDetails.tsx - Individual Brief Details Page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/components/button";
import { ArrowLeftIcon, EditIcon, DownloadIcon, Share2Icon } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { BriefTaskSection } from "../components/BriefTaskSection";
import { Brief } from "../types/brief";
import { BriefTask } from "../types/briefDetails";

// Extended brief details interface
interface BriefDetailData extends Brief {
  content: string;
  objectives: string[];
  methodology: string;
  findings: string;
  recommendations: string[];
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }>;
  timeline: Array<{
    id: string;
    event: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
}

// Mock data for individual brief details
const mockBriefDetails: Record<string, BriefDetailData> = {
  "b1": {
    id: "b1",
    clientName: "General Dynamics",
    projectType: "Strategic Defense Analysis",
    progress: 75,
    status: "In Progress",
    lastUpdated: "2025-05-29T10:30:00Z",
    tags: ["Strategy", "Defense", "High Priority"],
    description: "Comprehensive strategic analysis for next-generation defense technologies",
    createdAt: "2025-05-15T09:00:00Z",
    content: "This strategic defense analysis focuses on evaluating emerging technologies and their potential applications in modern defense systems. The analysis encompasses market trends, technological capabilities, competitive landscape, and strategic recommendations for positioning in the evolving defense sector.",
    objectives: [
      "Assess current market trends in defense technology",
      "Evaluate competitive positioning and opportunities",
      "Identify emerging technologies with strategic potential",
      "Develop recommendations for technology investments",
      "Create roadmap for market expansion"
    ],
    methodology: "The analysis employs a multi-faceted approach combining market research, technology assessment, competitive analysis, and stakeholder interviews. Primary data collection includes surveys with industry experts, while secondary research covers market reports, patent filings, and regulatory documentation.",
    findings: "The defense technology market is experiencing rapid transformation driven by AI, autonomous systems, and cybersecurity demands. Key findings indicate significant opportunities in emerging markets, with particular strength in areas where General Dynamics has existing capabilities. The competitive landscape shows consolidation trends that present both challenges and opportunities.",
    recommendations: [
      "Accelerate investment in AI-driven defense systems",
      "Expand partnerships with emerging technology companies",
      "Strengthen cybersecurity capabilities across all platforms",
      "Develop next-generation autonomous systems",
      "Increase presence in international markets"
    ],
    attachments: [
      {
        id: "a1",
        name: "Market Analysis Report.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedAt: "2025-05-20T10:00:00Z"
      },
      {
        id: "a2",
        name: "Competitive Landscape.xlsx",
        type: "Excel",
        size: "1.8 MB",
        uploadedAt: "2025-05-22T14:30:00Z"
      },
      {
        id: "a3",
        name: "Technology Assessment.docx",
        type: "Word",
        size: "3.1 MB",
        uploadedAt: "2025-05-25T09:15:00Z"
      }
    ],
    timeline: [
      {
        id: "t1",
        event: "Project Initiation",
        date: "2025-05-15T09:00:00Z",
        status: "completed"
      },
      {
        id: "t2",
        event: "Market Research Phase",
        date: "2025-05-20T10:00:00Z",
        status: "completed"
      },
      {
        id: "t3",
        event: "Stakeholder Interviews",
        date: "2025-05-25T14:00:00Z",
        status: "completed"
      },
      {
        id: "t4",
        event: "Analysis & Synthesis",
        date: "2025-05-30T10:00:00Z",
        status: "in-progress"
      },
      {
        id: "t5",
        event: "Final Report Preparation",
        date: "2025-06-05T09:00:00Z",
        status: "pending"
      },
      {
        id: "t6",
        event: "Client Presentation",
        date: "2025-06-10T14:00:00Z",
        status: "pending"
      }
    ]
  }
};

// Mock tasks for this specific brief
const mockBriefTasks: BriefTask[] = [
  {
    id: "bt1",
    title: "Complete market trend analysis",
    status: "Complete",
    assignee: "Sarah Chen",
    dueDate: "2025-05-28T00:00:00Z",
    priority: "High",
    description: "Analyze current and emerging market trends in defense technology"
  },
  {
    id: "bt2",
    title: "Conduct competitive landscape review",
    status: "In Progress",
    assignee: "Michael Rodriguez",
    dueDate: "2025-06-02T00:00:00Z",
    priority: "Critical",
    description: "Review competitive positioning and identify key competitors"
  },
  {
    id: "bt3",
    title: "Finalize technology assessment",
    status: "In Progress",
    assignee: "Jennifer Kim",
    dueDate: "2025-06-05T00:00:00Z",
    priority: "High",
    description: "Complete assessment of emerging technologies and their applications"
  },
  {
    id: "bt4",
    title: "Prepare executive summary",
    status: "Pending",
    assignee: "David Thompson",
    dueDate: "2025-06-08T00:00:00Z",
    priority: "Medium",
    description: "Create executive summary for stakeholder presentation"
  }
];

export const BriefDetails = (): JSX.Element => {
  const { briefId } = useParams<{ briefId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [briefDetails, setBriefDetails] = useState<BriefDetailData | null>(null);
  const [tasks, setTasks] = useState<BriefTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brief details
  useEffect(() => {
    const fetchBriefDetails = async () => {
      if (!briefId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const details = mockBriefDetails[briefId];
        if (!details) {
          setError("Brief not found");
          return;
        }
        
        setBriefDetails(details);
        setTasks(mockBriefTasks);
      } catch (error) {
        console.error("Error fetching brief details:", error);
        setError("Failed to load brief details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBriefDetails();
  }, [briefId]);

  // Generate breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Briefs Management", path: "/briefs" }
    ];
    
    if (briefDetails) {
      // We'd need to determine the entity type and ID to create proper breadcrumbs
      // For now, using a generic path back to briefs
      items.push({
        label: briefDetails.clientName,
        path: "/briefs" // Would be dynamic based on entity
      });
      items.push({
        label: briefDetails.projectType,
        path: `/briefs/details/${briefId}`
      });
    }
    
    return items;
  }, [briefDetails, briefId]);

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (progress >= 50) return isDark ? 'bg-blue-500' : 'bg-blue-600';
    if (progress >= 25) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    return isDark ? 'bg-red-500' : 'bg-red-600';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'In Progress': return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'Review': return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Draft': return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
      default: return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
  };

  // Get timeline status styles
  const getTimelineStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          dot: isDark ? 'bg-green-500' : 'bg-green-600',
          line: isDark ? 'bg-green-500' : 'bg-green-600'
        };
      case 'in-progress':
        return {
          dot: isDark ? 'bg-blue-500' : 'bg-blue-600',
          line: isDark ? 'bg-blue-500' : 'bg-blue-600'
        };
      default:
        return {
          dot: isDark ? 'bg-gray-600' : 'bg-gray-300',
          line: isDark ? 'bg-gray-600' : 'bg-gray-300'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle actions
  const handleEdit = () => {
    console.log("Edit brief:", briefDetails);
    // TODO: Implement edit functionality
  };

  const handleExport = () => {
    console.log("Export brief:", briefDetails);
    // TODO: Implement export functionality
  };

  const handleShare = () => {
    console.log("Share brief:", briefDetails);
    // TODO: Implement share functionality
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
  if (error || !briefDetails) {
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
            Back to Briefs Management
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
            onClick={() => navigate(-1)}
            className={`mr-4 ${
              isDark 
              ? "text-gray-300 hover:bg-[#201e3d]" 
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Brief Header */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {briefDetails.projectType}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(briefDetails.status)
                }`}>
                  {briefDetails.status}
                </span>
              </div>
              
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {briefDetails.clientName}
              </p>
              
              <p className={`mb-4 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {briefDetails.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {briefDetails.tags?.map((tag, index) => (
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
                onClick={handleEdit}
                variant="outline"
                className={`${
                  isDark 
                  ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className={`${
                  isDark 
                  ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Share2Icon className="w-4 h-4 mr-2" />
                Share
              </Button>
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
                Progress
              </span>
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                {briefDetails.progress}% complete
              </span>
            </div>
            <div className={`w-full h-3 rounded-full ${
              isDark ? "bg-[#2e2c50]" : "bg-gray-200"
            }`}>
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  getProgressColor(briefDetails.progress)
                }`}
                style={{ width: `${briefDetails.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brief Content */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Overview
              </h3>
              <p className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}>
                {briefDetails.content}
              </p>
            </div>

            {/* Objectives */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Objectives
              </h3>
              <ul className="space-y-2">
                {briefDetails.objectives.map((objective, index) => (
                  <li key={index} className={`flex items-start space-x-3 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      isDark ? "bg-blue-400" : "bg-blue-600"
                    }`}></span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methodology */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Methodology
              </h3>
              <p className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}>
                {briefDetails.methodology}
              </p>
            </div>

            {/* Findings */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Key Findings
              </h3>
              <p className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}>
                {briefDetails.findings}
              </p>
            </div>

            {/* Recommendations */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Recommendations
              </h3>
              <ul className="space-y-3">
                {briefDetails.recommendations.map((recommendation, index) => (
                  <li key={index} className={`flex items-start space-x-3 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
                    }`}>
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Timeline
              </h3>
              <div className="space-y-4">
                {briefDetails.timeline.map((item, index) => {
                  const styles = getTimelineStatusStyles(item.status);
                  const isLast = index === briefDetails.timeline.length - 1;
                  
                  return (
                    <div key={item.id} className="relative">
                      <div className="flex items-start space-x-3">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
                          {!isLast && (
                            <div className={`w-0.5 h-6 mt-1 ${styles.line}`}></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}>
                            {item.event}
                          </p>
                          <p className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attachments */}
            <div className={`rounded-lg border p-6 ${
              isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                Attachments
              </h3>
              <div className="space-y-3">
                {briefDetails.attachments.map((attachment) => (
                  <div key={attachment.id} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? "bg-[#201e3d]" : "bg-gray-50"
                  }`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {attachment.name}
                      </p>
                      <p className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {attachment.type} • {attachment.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${
                        isDark 
                        ? "text-blue-400 hover:bg-[#17162e]" 
                        : "text-blue-600 hover:bg-gray-100"
                      }`}
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <BriefTaskSection 
            tasks={tasks}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};