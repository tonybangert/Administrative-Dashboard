import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id}
               className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl
                          animate-fade-in-up min-w-[280px] max-w-[400px]"
               style={{
                 background: toast.type === "error" ? "rgba(239,69,55,0.15)" : "rgba(52,211,153,0.15)",
                 borderColor: toast.type === "error" ? "rgba(239,69,55,0.25)" : "rgba(52,211,153,0.25)",
               }}>
            {toast.type === "error"
              ? <AlertTriangle size={16} className="text-brand-red shrink-0" />
              : <CheckCircle size={16} className="text-brand-green shrink-0" />}
            <span className="text-sm text-text-primary flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}
                    className="text-text-muted hover:text-text-primary cursor-pointer bg-transparent border-none shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
