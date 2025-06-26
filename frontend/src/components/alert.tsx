import React, { useEffect } from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type?: AlertType;
  message: string;
  onClose: () => void;
  duration?: number; 
}

const alertColors = {
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 max-w-sm w-full shadow-lg rounded-md border p-4 flex items-start space-x-2 transition-all animate-fade-in ${alertColors[type]}`}
    >
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onClose} className="text-xl leading-none focus:outline-none">
        ×
      </button>
    </div>
  );
};
