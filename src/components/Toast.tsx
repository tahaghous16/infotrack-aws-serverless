import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error';
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-up ${
        type === 'success'
          ? 'bg-card border-success/20 text-foreground'
          : 'bg-card border-destructive/20 text-foreground'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
      )}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: 'success' | 'error'; message: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
