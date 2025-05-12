import React, { useState } from "react";
import { Button } from "./components/button";
import { X, AlertTriangleIcon } from "lucide-react";

interface DeleteModuleConfirmationModalProps {
  moduleName: string;
  onDelete: () => void;
  onCancel: () => void;
  isDark: boolean;
}

export const DeleteModuleConfirmationModal: React.FC<DeleteModuleConfirmationModalProps> = ({
  moduleName,
  onDelete,
  onCancel,
  isDark
}) => {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmEnabled = confirmText.toLowerCase() === "delete";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with higher opacity */}
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onCancel}></div>
      
      {/* Modal content */}
      <div className={`relative rounded-lg shadow-xl w-full max-w-md mx-auto ${
        isDark ? "bg-[#17162e] text-white" : "bg-white text-gray-800"
      }`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-500 flex items-center">
            <AlertTriangleIcon className="w-5 h-5 mr-2" />
            Confirm Module Deletion
          </h2>
          <button 
            onClick={onCancel}
            className={`p-1 rounded-full ${
              isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"
            } transition-colors duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Are you sure you want to delete the module <span className="font-medium">"{moduleName}"</span>? This action cannot be undone.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Type <span className="font-bold">delete</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              className={`w-full rounded-lg px-3 py-2 ${
                isDark 
                ? "bg-[#201e3d] border-[#2e2c50] text-white" 
                : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 ${
                isDark ? "focus:ring-red-500" : "focus:ring-red-600"
              }`}
            />
            <p className="mt-2 text-xs text-gray-500">
              This will permanently delete this module and all of its content.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={`${
                isDark 
                ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onDelete}
              disabled={!isConfirmEnabled}
              className={`${
                isConfirmEnabled
                  ? isDark 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                  : isDark
                    ? "bg-red-800/50 text-gray-400 cursor-not-allowed"
                    : "bg-red-300 text-gray-100 cursor-not-allowed"
              }`}
            >
              Delete Module
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};