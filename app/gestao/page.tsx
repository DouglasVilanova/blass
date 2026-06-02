import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { getCategories, getProducts, getBlogPosts } from "@/lib/db";
import { createAdminSupabase } from "@/lib/supabase/server";

async function checkSupabase() {
  try {
    const sb = createAdminSupabase();
    const { error } = await sb.from("settings").select("id").eq("id", 1).single();
    if (error) return { ok: false, msg: error.message };
    return { ok: true, msg: "Conectado" };
  } catch (e: any) {
    return { ok: false, msg: e?.message ?? "Erro de conexão" };
  }
}

async function checkStorage() {
  try {
    const sb = createAdminSupabase();
    const { data, error } = await sb.storage.getBucket("site-images");
    if (error) return { ok: false, msg: 'Bucket não existe — rode supabase/storage.sql' };
    return { ok: true, msg: `Bucket "${data.name}" ativo` };
  } catch (e: any) {
    return { ok: false, msg: e?.message ?? "Erro storage" };
  }
}

export default async function GestaoDashboard() {
  const [dbStatus, storageStatus, categories, products, posts] = await Promise.all([
    checkSupabase(),
    checkStorage(),
    getCategories().catch(() => []),
    getProducts().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const stats = [
    { label: "Produtos", value: products.length, href: "/gestao/produtos" },
    { label: "Categorias", value: categories.length, href: "/gestao/categorias" },
    { label: "Subcategorias", value: categories.reduce((n, c) => n + c.subcategories.length, 0), href: "/gestao/categorias" },
    { label: "Posts blog", value: posts.length, href: "/gestao/blog" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-brown">Painel</h1>
        <p className="text-brown/60 mt-1">Visão geral e status do sistema.</p>
      </div>

      {/* Status cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <StatusCard
          label="Banco de dados (Supabase)"
          ok={dbStatus.ok}
          msg={dbStatus.msg}
        />
        <StatusCard
          label="Storage de imagens"
          ok={storageStatus.ok}
          msg={storageStatus.msg}
          warn={!storageStatus.ok}
        />
      </div>

      {/* Counts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="block bg-white border border-brown/10 hover:border-orange p-6 transition-colors group"
          >
            <div className="text-[10px] tracking-widest text-brown/50 font-semibold uppercase">{s.label}</div>
            <div className="font-display text-4xl text-brown mt-2 group-hover:text-orange transition-colors">{s.value}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      {!storageStatus.ok && (
        <div className="bg-orange/10 border border-orange/30 p-4 text-sm text-brown">
          <strong>Storage não configurado.</strong> Abra o Supabase SQL Editor e rode o conteúdo de{" "}
          <code className="bg-brown/10 px-1">supabase/storage.sql</code>.
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, ok, msg, warn }: { label: string; ok: boolean; msg: string; warn?: boolean }) {
  return (
    <div className={`bg-white border p-5 flex items-start gap-3 ${ok ? "border-brown/10" : warn ? "border-orange/40" : "border-red-200"}`}>
      {ok
        ? <CheckCircle2 className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
        : warn
          ? <AlertCircle className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
          : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      }
      <div>
        <div className="text-xs tracking-widest text-brown/50 font-semibold uppercase">{label}</div>
        <div className={`text-sm mt-0.5 font-medium ${ok ? "text-brown" : "text-red-600"}`}>{msg}</div>
      </div>
    </div>
  );
}
