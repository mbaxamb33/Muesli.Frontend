import React, { useState } from "react";
import { ModulesSection } from "./ModuleSection";
import { Module } from "../types/module";
import { Loader, BarChart, FileTextIcon } from "lucide-react";

interface ExtractedParagraphsProps {
  modules: Module[];
  isLoading: boolean;
  isDark: boolean;
  onUpdateModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  status: string;
}

export const ExtractedParagraphs: React.FC<ExtractedParagraphsProps> = ({
  modules,
  isLoading,
  isDark,
  onUpdateModule,
  onDeleteModule,
  status
}) => {
  const [showSummary, setShowSummary] = useState<boolean>(true);

  const getEmptyStateMessage = () => {
    if (status === 'Not extracted') {
      return "This datasource hasn't been processed yet. Process it to extract paragraphs.";
    } else if (status === 'In queue' || status === 'Extracting') {
      return "Datasource is currently being processed. Paragraphs will appear here when processing is complete.";
    } else {
      return "No paragraphs found for this datasource.";
    }
  };

  const getTotalWordCount = () => {
    return modules.reduce((count, module) => {
      return count + module.content.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
  };

  const getAverageParagraphLength = () => {
    if (modules.length === 0) return 0;
    const totalWords = getTotalWordCount();
    return Math.round(totalWords / modules.length);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Extracted Paragraphs
        </h2>
        
        {modules.length > 0 && (
          <button
            onClick={() => setShowSummary(!showSummary)}
            className={`text-sm underline ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            {showSummary ? 'Hide Summary' : 'Show Summary'}
          </button>
        )}
      </div>
      
      {modules.length > 0 && showSummary && (
        <div className={`p-4 rounded-lg mb-6 ${
          isDark ? 'bg-[#201e3d] text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-opacity-20 flex flex-col items-center justify-center">
              <div className={`text-2xl font-bold ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              } flex items-center`}>
                <FileTextIcon className="w-5 h-5 mr-2" />
                {modules.length}
              </div>
              <div className="text-sm mt-1">Total Paragraphs</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-opacity-20 flex flex-col items-center justify-center">
              <div className={`text-2xl font-bold ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {getAverageParagraphLength()}
              </div>
              <div className="text-sm mt-1">Avg. Words per Paragraph</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-opacity-20 flex flex-col items-center justify-center">
              <div className={`text-2xl font-bold ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              } flex items-center`}>
                <BarChart className="w-5 h-5 mr-2" />
                {getTotalWordCount()}
              </div>
              <div className="text-sm mt-1">Total Words</div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && modules.length === 0 ? (
        <div className={`flex justify-center items-center p-8 rounded-lg border ${
          isDark ? "border-[#2e2c50] bg-[#17162e] text-gray-300" : "border-gray-200 bg-white text-gray-500"
        }`}>
          <Loader className="w-5 h-5 mr-3 animate-spin" />
          Loading paragraphs...
        </div>
      ) : modules.length === 0 ? (
        <div className={`p-8 rounded-lg border ${
          isDark ? "border-[#2e2c50] bg-[#17162e]" : "border-gray-200 bg-white"
        }`}>
          <div className="text-center">
            <div className={`flex justify-center mb-4 ${
              status === 'Not extracted' 
                ? 'text-gray-400' 
                : status === 'In queue' || status === 'Extracting'
                  ? isDark ? 'text-blue-400' : 'text-blue-600'
                  : 'text-gray-400'
            }`}>
              {status === 'Extracting' ? (
                <Loader className="w-12 h-12 animate-spin" />
              ) : status === 'In queue' ? (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-dashed animate-spin border-blue-500"></div>
                </div>
              ) : (
                <FileTextIcon className="w-12 h-12" />
              )}
            </div>
            <p className={`${
              isDark ? "text-gray-300" : "text-gray-500"
            } text-lg font-medium mb-2`}>
              {status === 'Not extracted' 
                ? "No Content Extracted Yet" 
                : status === 'In queue'
                  ? "Processing Queued"
                  : status === 'Extracting'
                    ? "Extracting Content"
                    : "No Paragraphs Found"}
            </p>
            <p className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } mb-4 max-w-lg mx-auto`}>
              {getEmptyStateMessage()}
            </p>
          </div>
        </div>
      ) : (
        <ModulesSection 
          modules={modules}
          isDark={isDark}
          onUpdateModule={onUpdateModule}
          onDeleteModule={onDeleteModule}
        />
      )}
    </div>
  );
};