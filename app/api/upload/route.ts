import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload";

export const runtime = "nodejs"; // Sharp needs Node.js runtime

export async function POST(req: NextRequest) {
  try {
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
