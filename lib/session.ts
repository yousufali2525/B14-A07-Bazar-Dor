import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
export async function requireSession(path: string) {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("সেশন চেক করতে ব্যর্থ:", error);
  }
  if (!session?.user) {
    redirect(`/signin?reason=protected&redirect=${encodeURIComponent(path)}`);
  }
  return session;
}