import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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

export function DetailModal({ isOpen, onClose, title, children }) {
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
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
