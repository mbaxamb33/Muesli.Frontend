// src/components/BriefTaskSection.tsx
import React from "react";
import { Clock, User, AlertCircle, CheckCircle, XCircle, Pause } from "lucide-react";
import { BriefTask } from "../types/briefDetails";

interface BriefTaskSectionProps {
  tasks: BriefTask[];
  isDark: boolean;
}

export const BriefTaskSection: React.FC<BriefTaskSectionProps> = ({ tasks, isDark }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Blocked': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'In Progress': return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'Blocked': return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800';
      case 'Pending': return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
      default: return isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return isDark ? 'text-gray-400' : 'text-gray-500';
      default: return isDark ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`rounded-lg border p-4 ${
      isDark ? "bg-[#17162e] border-[#2e2c50]" : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDark ? "text-white" : "text-gray-800"
        }`}>
          Related Tasks
        </h3>
        <span className={`text-sm ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          {tasks.filter(task => task.status === 'Complete').length} of {tasks.length} complete
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className={`text-center py-8 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          <p>No tasks associated with this brief process</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div 
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDark 
                  ? "bg-[#201e3d] border-[#2e2c50] hover:border-[#3e3c60]" 
                  : "bg-gray-50 border-gray-100 hover:border-gray-200"
              } transition-colors duration-200`}
            >
              <div className="flex items-center space-x-3 flex-1">
                {getStatusIcon(task.status)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-medium truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {task.title}
                    </h4>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                      getStatusColor(task.status)
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {task.assignee}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
              </div>
            </div>
          ))}
          
          {tasks.length > 5 && (
            <div className={`text-center py-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <span className="text-sm">
                And {tasks.length - 5} more tasks...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};