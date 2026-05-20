import { ReactNode } from "react";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest text-brown/70 font-semibold uppercase">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <p className="text-[11px] text-brown/50 mt-1">{hint}</p>}
    </label>
  );
}

export const inputCls =
  "w-full border border-brown/20 bg-white px-3 py-2 text-sm focus:outline-none focus:border-orange";
