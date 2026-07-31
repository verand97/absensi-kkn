"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// ─── useToast Hook ────────────────────────────────────────────────────────────

let globalAdd: ((type: ToastType, message: string) => void) | null = null;

export function useToast() {
  const toast = useCallback(
    (type: ToastType, message: string) => {
      if (globalAdd) globalAdd(type, message);
    },
    []
  );

  return {
    toast,
    success: (msg: string) => toast("success", msg),
    error: (msg: string) => toast("error", msg),
    warning: (msg: string) => toast("warning", msg),
  };
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const DURATION = 4000;

const styles: Record<ToastType, { border: string; icon: string; progress: string; bg: string }> = {
  success: {
    bg: "bg-white dark:bg-[#12141C]",
    border: "border-[#80FF56]/50",
    icon: "text-[#80FF56]",
    progress: "bg-[#80FF56]",
  },
  error: {
    bg: "bg-white dark:bg-[#12141C]",
    border: "border-red-500/50",
    icon: "text-red-400",
    progress: "bg-red-500",
  },
  warning: {
    bg: "bg-white dark:bg-[#12141C]",
    border: "border-amber-400/50",
    icon: "text-amber-400",
    progress: "bg-amber-400",
  },
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  error: <XCircle className="w-5 h-5 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const s = styles[toast.type];
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Mount animation
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(id);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast.id, onDismiss]);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden flex items-start gap-3
        ${s.bg} border ${s.border}
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        px-4 pt-4 pb-3 min-w-72 max-w-sm w-full
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
      style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
    >
      {/* Icon */}
      <span className={`mt-0.5 ${s.icon}`}>{icons[toast.type]}</span>

      {/* Message */}
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1 leading-snug pr-2">
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={dismiss}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors mt-0.5 shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full ${s.progress} origin-left`}
          style={{
            animation: `shrink ${DURATION}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Toast Container (mount once in layout / root) ────────────────────────────

let _counter = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = ++_counter;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  useEffect(() => {
    globalAdd = add;
    return () => { globalAdd = null; };
  }, [add]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-200 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
