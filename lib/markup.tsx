import React from "react";

/**
 * Renderiza texto com **destaque** → <strong> com a classe informada.
 * Permite editar no painel usando ** ao redor da parte destacada.
 */
export function renderMarks(text: string, markClass: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={markClass}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
