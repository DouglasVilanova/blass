"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Toast = { id: number; message: string; tone: "success" | "error" };
type Ctx = { push: (message: string, tone?: "success" | "error") => void };

const ToastCtx = createContext<Ctx>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, message, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 text-sm shadow-lg text-white ${t.tone === "success" ? "bg-orange" : "bg-red-600"}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
