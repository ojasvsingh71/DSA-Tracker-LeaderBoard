import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="bg-white dark:bg-[#1e1e2f] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform overflow-hidden p-6 transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDestructive ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" : "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {message}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-white font-medium transition text-sm cursor-pointer ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
