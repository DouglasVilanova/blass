/**
 * Monta um link wa.me robusto a partir de um telefone digitado de qualquer forma.
 * Aceita: "5430229600", "(54) 3022-9600", "+55 54 3022-9600", "55 54 3022 9600"…
 * - Remove tudo que não é dígito
 * - Garante o código do Brasil (55) sem duplicar
 * Retorna "" se não houver número (caller pode usar fallback).
 */
export function waLink(raw?: string, text?: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (!digits.startsWith("55")) digits = "55" + digits;
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
