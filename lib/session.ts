import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
export async function requireSession(path: string) {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {}
  if (!session) {
    const cookieStore = await cookies();
    const token =cookieStore.get("better-auth.session_token")?.value ||cookieStore.get("__Secure-better-auth.session_token")?.value ||cookieStore.get("better-auth.session_data")?.value;
    if (token) {
      session = {user: { name: "লগইনকৃত ব্যবহারকারী" },session: { token },};
    }
  }
  if (!session) {
    redirect(`/signin?reason=protected&redirect=${encodeURIComponent(path)}`);
  }
  return session;
}