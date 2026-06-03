import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "./session";

/**
 * Call at the top of every Server Action that writes data.
 * Returns the admin email.
 * Redirects to login if session invalid/expired.
 */
export async function requireAdmin(): Promise<string> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) redirect("/gestao/login");
  const email = await verifyToken(token);
  if (!email) redirect("/gestao/login");
  return email;
}

export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Mínimo 10 caracteres.";
  if (!/[A-Z]/.test(password)) return "Deve conter ao menos uma letra maiúscula.";
  if (!/[a-z]/.test(password)) return "Deve conter ao menos uma letra minúscula.";
  if (!/[0-9]/.test(password)) return "Deve conter ao menos um número.";
  return null;
}
