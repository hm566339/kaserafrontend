import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useApi } from "../context/ApiContext";

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const toastColors = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    text: "text-green-900",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    text: "text-red-900",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    text: "text-blue-900",
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApi();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type] || Info;
          const colors = toastColors[toast.type] || toastColors.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${colors.bg} ${colors.border}`}
            >
              <Icon size={20} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
              <p className={`flex-1 text-sm font-medium ${colors.text}`}>{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className={`flex-shrink-0 p-0.5 rounded hover:bg-white/50 transition-colors ${colors.icon}`}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
