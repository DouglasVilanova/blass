"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, Info, X } from "lucide-react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual tone: "danger" para ações destrutivas (vermelho), "default" para ações comuns (laranja) */
  tone?: "danger" | "default";
};

type DialogState = ConfirmOptions & {
  resolve: (ok: boolean) => void;
};

type Ctx = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<Ctx>(() => Promise.resolve(false));

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<Ctx>((options) => {
    return new Promise((resolve) => {
      setDialog({ ...options, resolve });
    });
  }, []);

  // Auto-focus confirm button when dialog opens
  useEffect(() => {
    if (dialog) {
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [dialog]);

  // ESC closes (treats as cancel), Enter confirms
  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handle(false);
      if (e.key === "Enter") handle(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  function handle(ok: boolean) {
    if (!dialog) return;
    dialog.resolve(ok);
    setDialog(null);
  }

  const isDanger = dialog?.tone === "danger";

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brown-dark/70 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => handle(false)}
          />

          {/* Dialog box */}
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative bg-cream border-2 border-brown/20 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header bar (orange accent) */}
            <div className={`h-1.5 ${isDanger ? "bg-red-600" : "bg-orange"}`} />

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDanger ? "bg-red-100 text-red-600" : "bg-orange/10 text-orange"}`}>
                  {isDanger ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h2
                    id="confirm-title"
                    className="font-display text-xl text-brown leading-tight"
                  >
                    {dialog.title}
                  </h2>
                  {dialog.description && (
                    <p className="mt-2 text-sm text-brown/70 leading-relaxed whitespace-pre-line">
                      {dialog.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handle(false)}
                  className="text-brown/40 hover:text-brown -mt-1 -mr-1"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handle(false)}
                  className="px-5 py-2.5 text-sm font-semibold tracking-wide text-brown hover:bg-brown/5 border border-brown/20 transition-colors"
                >
                  {dialog.cancelLabel ?? "Cancelar"}
                </button>
                <button
                  ref={confirmBtnRef}
                  type="button"
                  onClick={() => handle(true)}
                  className={`px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors ${
                    isDanger
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-orange hover:bg-orange-dark"
                  }`}
                >
                  {dialog.confirmLabel ?? "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmCtx);
}
