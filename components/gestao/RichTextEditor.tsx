"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState, useEffect } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Link as LinkIcon, Image as ImageIcon, Undo2, Redo2, Minus, Code,
} from "lucide-react";
import { useToast } from "@/components/gestao/Toast";
import { compressImage } from "@/lib/client-image";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escreva aqui. Use a barra acima para formatar e inserir imagens…" }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "prose-blass min-h-[360px] px-5 py-4 focus:outline-none text-brown text-[15px] leading-[1.7]" },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current && next !== "<p></p>") {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="bg-cream-light border border-brown/20 rounded-lg min-h-[420px] animate-pulse" />;
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
      fd.append("folder", "blog");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) { push(json.error ?? "Erro no upload", "error"); return; }
      editor!.chain().focus().setImage({ src: json.url, alt: "" }).run();
      push("Imagem inserida");
    } finally {
      setUploading(false);
    }
  }

  function handleLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link (vazio para remover)", previous ?? "https://");
    if (url === null) return;
    if (url === "") { editor!.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="bg-white border border-brown/20 rounded-lg overflow-hidden focus-within:border-orange transition-colors">
      <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileRef.current?.click()} onInsertLink={handleLink} />
      <EditorContent editor={editor} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
      <style jsx global>{`
        .prose-blass p { margin: 0 0 0.9em; }
        .prose-blass h2 { font-size: 1.5rem; font-weight: 800; margin: 1.4em 0 0.5em; color: #4F2612; }
        .prose-blass h3 { font-size: 1.2rem; font-weight: 700; margin: 1.2em 0 0.4em; color: #4F2612; }
        .prose-blass ul, .prose-blass ol { padding-left: 1.4em; margin: 0 0 0.9em; }
        .prose-blass ul { list-style: disc; }
        .prose-blass ol { list-style: decimal; }
        .prose-blass li { margin-bottom: 0.3em; }
        .prose-blass a { color: #F0781A; text-decoration: underline; text-underline-offset: 2px; }
        .prose-blass blockquote { border-left: 3px solid #F0781A; padding-left: 1em; color: rgba(79,38,18,0.7); font-style: italic; margin: 1em 0; }
        .prose-blass img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.2em 0; display: block; }
        .prose-blass img.ProseMirror-selectednode { outline: 2px solid #F0781A; }
        .prose-blass hr { border: none; border-top: 1px solid rgba(79,38,18,0.15); margin: 1.5em 0; }
        .prose-blass code { background: rgba(79,38,18,0.08); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .prose-blass p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(79,38,18,0.35); pointer-events: none; height: 0; }
      `}</style>
    </div>
  );
}

function Toolbar({ editor, uploading, onPickImage, onInsertLink }: { editor: Editor; uploading: boolean; onPickImage: () => void; onInsertLink: () => void; }) {
  const btn = (active: boolean) =>
    `p-2 rounded-md transition-colors ${active ? "bg-orange text-white" : "text-brown/55 hover:text-brown hover:bg-brown/5"}`;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-brown/10 bg-cream-light">
      <ToolBtn title="Negrito" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} cls={btn}><Bold className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Itálico" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} cls={btn}><Italic className="w-4 h-4" /></ToolBtn>
      <Sep />
      <ToolBtn title="Título 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} cls={btn}><Heading2 className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Título 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} cls={btn}><Heading3 className="w-4 h-4" /></ToolBtn>
      <Sep />
      <ToolBtn title="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} cls={btn}><List className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} cls={btn}><ListOrdered className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Citação" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} cls={btn}><Quote className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Código" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} cls={btn}><Code className="w-4 h-4" /></ToolBtn>
      <Sep />
      <ToolBtn title="Link" onClick={onInsertLink} active={editor.isActive("link")} cls={btn}><LinkIcon className="w-4 h-4" /></ToolBtn>
      <ToolBtn title={uploading ? "Enviando..." : "Inserir imagem"} onClick={onPickImage} active={false} cls={btn} disabled={uploading}><ImageIcon className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} cls={btn}><Minus className="w-4 h-4" /></ToolBtn>
      <Sep />
      <ToolBtn title="Desfazer" onClick={() => editor.chain().focus().undo().run()} active={false} cls={btn} disabled={!editor.can().undo()}><Undo2 className="w-4 h-4" /></ToolBtn>
      <ToolBtn title="Refazer" onClick={() => editor.chain().focus().redo().run()} active={false} cls={btn} disabled={!editor.can().redo()}><Redo2 className="w-4 h-4" /></ToolBtn>
    </div>
  );
}

function ToolBtn({ title, onClick, active, cls, disabled, children }: { title: string; onClick: () => void; active: boolean; cls: (a: boolean) => string; disabled?: boolean; children: React.ReactNode; }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled}
      className={`${cls(active)} ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
}

function Sep() { return <span className="w-px h-5 bg-brown/10 mx-1" aria-hidden />; }
