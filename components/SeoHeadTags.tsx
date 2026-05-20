"use client";

import { useEffect } from "react";

export default function SeoHeadTags({ html }: { html: string }) {
  useEffect(() => {
    if (!html?.trim()) return;
    const tmp = document.createElement("template");
    tmp.innerHTML = html;
    const injected: Element[] = [];
    Array.from(tmp.content.childNodes).forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as Element;
      if (el.tagName === "SCRIPT") {
        const script = document.createElement("script");
        Array.from(el.attributes).forEach((a) => script.setAttribute(a.name, a.value));
        script.textContent = el.textContent;
        document.head.appendChild(script);
        injected.push(script);
      } else {
        const clone = el.cloneNode(true) as Element;
        document.head.appendChild(clone);
        injected.push(clone);
      }
    });
    return () => injected.forEach((n) => n.parentNode?.removeChild(n));
  }, [html]);
  return null;
}
