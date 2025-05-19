// src/components/ContactDebugger.tsx
import React, { useState } from "react";
import { Button } from "./components/button";
import { useTheme } from "../context/ThemeContext";

interface ContactDebuggerProps {
  onClose: () => void;
}

export const ContactDebugger: React.FC<ContactDebuggerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState<'add' | 'mock'>('add');

  // Test adding a contact with detailed error logging
  const testAddContact = async () => {
    setLoading(true);
    setResponseData(null);
    
    try {
      // Create a sample contact for testing
      const testContact = {
        name: "Test Contact",
        position: "Developer",
        email: "test@example.com",
        phone: "1234567890",
        notes: "Test contact for debugging",
        companyId: "7" // Make sure this matches your company ID
      };
      
      // Make the request with fetch for more control
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testContact),
      });
      
      // Get response text regardless of status code
      const responseText = await response.text();
      
      // Try to parse as JSON if possible
      let responseJson = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (e) {
        // Not JSON, keep as text
      }
      
      setResponseData({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data: responseJson || responseText
      });
      
      if (!response.ok) {
        console.error("Failed to add contact:", response.status, responseText);
      }
    } catch (error) {
      console.error("Error in test:", error);
      setResponseData({
        error: error.message || "Unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  // Test with a mock success to verify the UI flow
  const testMockSuccess = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setResponseData({
        status: 200,
        data: {
          id: "mock-id-123",
          name: "Test Contact",
          position: "Developer",
          email: "test@example.com",
          phone: "1234567890",
          notes: "Test contact for debugging",
        }
      });
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`relative rounded-lg shadow-xl w-full max-w-2xl mx-auto ${
        isDark ? "bg-[#17162e] text-white" : "bg-white text-gray-800"
      } p-6`}>
        <h2 className="text-xl font-semibold mb-4">Contact API Debugger</h2>
        
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={() => setTestMode('add')}
            className={`${
              testMode === 'add' 
                ? isDark ? "bg-blue-600" : "bg-blue-600 text-white"
                : isDark ? "bg-[#201e3d]" : "bg-gray-200"
            }`}
          >
            Test Real API
          </Button>
          <Button
            onClick={() => setTestMode('mock')}
            className={`${
              testMode === 'mock' 
                ? isDark ? "bg-blue-600" : "bg-blue-600 text-white"
                : isDark ? "bg-[#201e3d]" : "bg-gray-200"
            }`}
          >
            Test Mock Success
          </Button>
        </div>
        
        <Button
          onClick={testMode === 'add' ? testAddContact : testMockSuccess}
          className={`w-full ${
            isDark 
              ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" 
              : "bg-blue-700 hover:bg-blue-800 text-white"
          } mb-4`}
          disabled={loading}
        >
          {loading ? "Testing..." : "Run Test"}
        </Button>
        
        {responseData && (
          <div className={`mt-4 p-4 rounded-lg overflow-auto max-h-96 ${
            isDark ? "bg-[#201e3d]" : "bg-gray-100"
          }`}>
            <h3 className="font-medium mb-2">Response:</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};