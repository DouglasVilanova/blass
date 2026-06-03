/**
 * Stateless signed session via HMAC-SHA256.
 * Works in both Edge (middleware) and Node.js (server actions).
 * No DB required — credentials live in env vars.
 */

export const COOKIE_NAME = "blass_admin";
const SESSION_DAYS = 7;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var not set");
  return s;
}

async function getKey(secretStr: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secretStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(email: string): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${email}:${exp}`;
  const key = await getKey(secret());
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${btoa(payload)}.${sigB64}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;

    const payload = atob(payloadB64);
    const [email, expStr] = payload.split(":");
    if (!email || !expStr) return null;
    if (Date.now() > parseInt(expStr)) return null; // expired

    const key = await getKey(secret());
    const expectedSig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      expectedSig,
      new TextEncoder().encode(payload)
    );
    return valid ? email : null;
  } catch {
    return null;
  }
}

export function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/gestao",
    maxAge: maxAge ?? SESSION_DAYS * 24 * 60 * 60,
  };
}
