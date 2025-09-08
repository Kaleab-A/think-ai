import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ErrorAlertProps {
  isError: boolean;
  error: Error | null;
}

export const ErrorAlert = ({ isError, error }: ErrorAlertProps) => {
  const [showError, setShowError] = useState(isError);

  useEffect(() => {
    if (isError) {
      setShowError(true);
      //   const timer = setTimeout(() => setShowError(false), 5000); // Auto-hide after 5 seconds
      //   return () => clearTimeout(timer);
    }
  }, [isError]);

  if (!showError || !error) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-3">
        <span>
          {error.message || "An unexpected error occurred. Please try again."}
        </span>
        <button
          onClick={() => setShowError(false)}
          className="hover:bg-red-600 rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
