"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
    textColor: "text-green-800",
    progressColor: "bg-green-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
    textColor: "text-red-800",
    progressColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-500",
    textColor: "text-amber-800",
    progressColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    textColor: "text-blue-800",
    progressColor: "bg-blue-500",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string) => showToast(message, "success"), [showToast]);
  const error = useCallback((message: string) => showToast(message, "error"), [showToast]);
  const warning = useCallback((message: string) => showToast(message, "warning"), [showToast]);
  const info = useCallback((message: string) => showToast(message, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto animate-slide-in ${config.bgColor} ${config.borderColor} border rounded-xl shadow-lg p-4 flex items-start gap-3 relative overflow-hidden`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Message */}
              <p className={`flex-1 text-sm font-medium ${config.textColor}`}>
                {toast.message}
              </p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition`}
              >
                <X className="h-4 w-4" />
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
                <div
                  className={`h-full ${config.progressColor} animate-progress`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
