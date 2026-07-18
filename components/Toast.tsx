'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout((show as any)._t);
    (show as any)._t = window.setTimeout(() => setMsg(null), 2400);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div style={{ position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', background: '#2c2925', color: '#f6f2ea', padding: '13px 22px', borderRadius: 11, fontSize: 13.5, fontWeight: 500, boxShadow: '0 12px 34px rgba(0,0,0,.3)', zIndex: 80 }}>
          {msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}
