import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SheetProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  isDark?: boolean;
}

export const Sheet = ({
  children,
  open,
  onClose,
  title,
  width = "500px",
  isDark = false,
}: SheetProps) => {
  // Handle escape key to close sheet
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black transition-opacity duration-400 ease-out z-40",
          open ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex flex-col h-full shadow-xl transform transition-all ease-[cubic-bezier(0.32,0.72,0,1)] duration-500",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width }}
      >
        <div 
          className={cn(
            "h-full overflow-y-auto",
            isDark ? "bg-[#17162e] text-white" : "bg-white text-gray-800"
          )}
        >
          {/* Header */}
          {title && (
            <div className={cn(
              "flex justify-between items-center px-6 py-4 border-b transition-opacity duration-300", 
              isDark ? "border-[#2e2c50]" : "border-gray-200",
              open ? "opacity-100" : "opacity-0"
            )}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className={cn(
                  "p-1 rounded-full transition-colors duration-200",
                  isDark ? "hover:bg-[#201e3d]" : "hover:bg-gray-100"
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div 
            className={cn(
              "flex-1 transition-all duration-500 delay-100",
              open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};