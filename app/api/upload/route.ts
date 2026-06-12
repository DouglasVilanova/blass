import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadImage } from "@/lib/upload";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export const runtime = "nodejs"; // Sharp needs Node.js runtime

export async function POST(req: NextRequest) {
  try {
    // Auth: somente admin logado pode subir imagens
    const token = cookies().get(COOKIE_NAME)?.value;
    const email = token ? await verifyToken(token) : null;
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string | null) ?? "products";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
    }

    const validFolders = ["products", "blog", "site"];
    const safeFolder = validFolders.includes(folder)
      ? (folder as "products" | "blog" | "site")
      : "products";

    const result = await uploadImage(file as File, safeFolder);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[upload]", err);
    return NextResponse.json({ error: err.message ?? "Erro no upload" }, { status: 500 });
  }
}
