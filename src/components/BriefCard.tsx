// src/components/BriefCard.tsx
import React from "react";
import { Button } from "./components/button";
import { EditIcon, ArchiveIcon, Clock } from "lucide-react";
import { Brief } from "../types/brief";

interface BriefCardProps {
  brief: Brief;
  isDark: boolean;
  onEdit: (brief: Brief) => void;
  onArchive: (brief: Brief) => void;
  onClick: (briefId: string) => void;
}

export const BriefCard: React.FC<BriefCardProps> = ({ 
  brief, 
  isDark, 
  onEdit, 
  onArchive, 
  onClick 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'In Progress': return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'Review': return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Draft': return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
      case 'Archived': return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800';
      default: return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (progress >= 50) return isDark ? 'bg-blue-500' : 'bg-blue-600';
    if (progress >= 25) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    return isDark ? 'bg-red-500' : 'bg-red-600';
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

  return (
    <div 
      className={`rounded-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isDark 
          ? "bg-[#17162e] border-[#2e2c50] hover:border-[#3e3c60]" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onClick(brief.id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {brief.clientName}
          </h3>
          <p className={`text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            {brief.projectType}
          </p>
        </div>
        
        {/* Status Tag */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getStatusColor(brief.status)
        }`}>
          {brief.status}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Progress
          </span>
          <span className={`text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {brief.progress}% complete
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          isDark ? "bg-[#2e2c50]" : "bg-gray-200"
        }`}>
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              getProgressColor(brief.progress)
            }`}
            style={{ width: `${brief.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Tags */}
      {brief.tags && brief.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {brief.tags.map((tag, index) => (
            <span 
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                isDark 
                  ? "bg-[#201e3d] text-gray-300" 
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Updated {formatDate(brief.lastUpdated)}</span>
        </div>
        
        <div className="flex space-x-2">
          {brief.status === 'Archived' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(brief);
              }}
              className={`${
                isDark 
                ? "text-blue-400 hover:bg-[#201e3d] hover:text-blue-300" 
                : "text-blue-600 hover:bg-gray-100 hover:text-blue-800"
              }`}
            >
              <EditIcon className="w-4 h-4 mr-1" />
              Restore
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(brief);
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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(brief);
                }}
                className={`${
                  isDark 
                  ? "text-gray-400 hover:bg-[#201e3d] hover:text-gray-300" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <ArchiveIcon className="w-4 h-4 mr-1" />
                Archive
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};