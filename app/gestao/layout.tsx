// Minimal wrapper — login lives here (no sidebar)
// Sidebar lives in (panel)/layout.tsx
import { ToastProvider } from "@/components/gestao/Toast";

export default function GestaoRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
