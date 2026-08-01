import { useState, useEffect, useCallback } from "react";
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

let toastId = 0;
let globalAddToast = null;

export function toast(message, type = "success", duration = 3500) {
  if (globalAddToast) globalAddToast({ id: ++toastId, message, type, duration });
}

const icons = {
  success: <FaCheck className="text-emerald-400" />,
  error: <FaExclamationTriangle className="text-red-400" />,
  info: <FaInfoCircle className="text-blue-400" />,
};
const borders = { success: "border-emerald-500/40", error: "border-red-500/40", info: "border-blue-500/40" };

function ToastItem({ message, type, onRemove }) {
  useEffect(() => { return () => {}; }, []);
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-xl border ${borders[type] || borders.info} shadow-2xl text-white text-sm font-medium max-w-sm animate-slideInRight`}>
      <span className="text-base flex-shrink-0">{icons[type] || icons.info}</span>
      <p className="flex-1 leading-snug">{message}</p>
      <button onClick={onRemove} className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), t.duration);
  }, []);

  useEffect(() => { globalAddToast = addToast; return () => { globalAddToast = null; }; }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        </div>
      ))}
    </div>
  );
}
