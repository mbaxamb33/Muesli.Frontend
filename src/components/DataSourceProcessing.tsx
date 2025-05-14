import React, { useState, useEffect } from "react";
import { Button } from "./components/button";
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon } from "lucide-react";
import { datasourceAPI } from "../services/api";
import { ProcessingAnimation } from "./ProcessingAnimation";

interface DataSourceProcessingProps {
  dataSourceId: string;
  status: string;
  processDatasource: () => Promise<void>;
  isDark: boolean;
  onProcessingComplete: () => void;
}

export const DataSourceProcessing: React.FC<DataSourceProcessingProps> = ({
  dataSourceId,
  status,
  processDatasource,
  isDark,
  onProcessingComplete
}) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Poll for status changes if the datasource is being processed
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (processing || status === 'In queue' || status === 'Extracting') {
      // Set initial progress based on status
      if (status === 'In queue') {
        setProgress(30);
      } else if (status === 'Extracting') {
        setProgress(60);
      }
      
      // Poll for updates every 3 seconds
      interval = setInterval(async () => {
        try {
          // Check the current status from the backend
          const currentStatus = await datasourceAPI.getProcessingStatus(dataSourceId);
          
          // Update progress based on status
          if (currentStatus === 'In queue') {
            setProgress(prev => Math.max(prev, 30));
          } else if (currentStatus === 'Extracting') {
            setProgress(prev => Math.max(prev, 60));
          } else if (currentStatus === 'Processed') {
            setProcessing(false);
            setProgress(100);
            if (interval) clearInterval(interval);
            onProcessingComplete();
          }
        } catch (error) {
          console.error("Error checking processing status:", error);
          // If we can't check the status, just increment progress slightly
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + 1;
          });
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processing, status, onProcessingComplete, dataSourceId]);
  
  const handleProcessClick = async () => {
    setError(null);
    setProcessing(true);
    setProgress(15); // Initial progress
    
    try {
      await processDatasource();
      // Processing has started
      setProgress(30);
    } catch (err) {
      setError("Failed to start processing. Please try again.");
      setProcessing(false);
      setProgress(0);
    }
  };
  
  const getStatusDisplay = () => {
    switch (status) {
      case 'Processed':
        return (
          <div className="flex items-center">
            <CheckCircleIcon className={`w-5 h-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span>Processing complete</span>
          </div>
        );
      case 'Not extracted':
        return "This datasource hasn't been processed yet";
      case 'In queue':
        return "Waiting to be processed";
      case 'Extracting':
        return "Currently extracting content";
      default:
        return "Unknown status";
    }
  };
  
  return (
    <div className={`p-5 rounded-lg ${
      isDark ? 'bg-[#201e3d]' : 'bg-gray-50'
    }`}>
      <h3 className={`text-lg font-medium mb-3 ${
        isDark ? 'text-gray-200' : 'text-gray-700'
      }`}>
        Processing Information
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <ProcessingAnimation status={status} isDark={isDark} />
          </div>
          
          <div className="w-full md:w-2/3">
            <h4 className={`text-sm font-medium mb-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Status
            </h4>
            <div className={`w-full h-2 rounded-full ${
              isDark ? 'bg-[#2e2c50]' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-700 ${
                  status === 'Processed' 
                    ? isDark ? 'bg-green-500' : 'bg-green-600'
                    : processing || status === 'In queue' || status === 'Extracting'
                      ? isDark ? 'bg-blue-500' : 'bg-blue-600'
                      : isDark ? 'bg-gray-700' : 'bg-gray-400'
                }`}
                style={{ width: `${
                  status === 'Processed' 
                    ? '100%' 
                    : processing || status === 'In queue' || status === 'Extracting'
                      ? `${progress}%`
                      : '0%'
                }` }}
              ></div>
            </div>
            <p className={`mt-1 text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {getStatusDisplay()}
            </p>
            
            {(status === 'In queue' || status === 'Extracting') && !error && (
              <p className={`mt-2 italic text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Processing will continue in the background. You can leave this page and come back later.
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <div className={`mt-2 p-2 rounded-md ${
            isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-start">
              <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {(status === 'Not extracted' || error) && (
          <Button
            onClick={handleProcessClick}
            className={`mt-4 ${
              isDark 
              ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
              : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
            disabled={processing}
          >
            {processing ? (
              <>
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Datasource"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};