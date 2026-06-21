import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastStyles = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  error: {
    bg: "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200",
    icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  },
  info: {
    bg: "bg-sky-50 dark:bg-sky-950/80 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200",
    icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
  },
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 scale-100 opacity-100 pointer-events-auto ${style.bg}`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
