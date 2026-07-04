import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, X } from "lucide-react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading, danger = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-start gap-4 p-6">
                <div
                  className={`flex-shrink-0 rounded-lg p-3 ${
                    danger ? "bg-red-100" : "bg-amber-100"
                  }`}
                >
                  <AlertCircle
                    size={24}
                    className={danger ? "text-red-600" : "text-amber-600"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{message}</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-3 border-t border-slate-200 p-6 sm:flex-row-reverse">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50 ${
                    danger
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Confirm
                </button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
