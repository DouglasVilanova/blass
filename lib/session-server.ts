import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "./session";

/** Returns admin email if authenticated, null otherwise. Safe to call in any server component. */
export async function getAdminEmail(): Promise<string | null> {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
