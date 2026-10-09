import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const DATA_FILE = path.join(process.cwd(), "auth-local.json");
function readStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], sessions: [] }));
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } 
  catch {
    return { users: [], sessions: [] };
  }
}
function writeStore(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } 
  catch {}
}
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const store = readStore();
  if (pathname.includes("/sign-up/email")) {
    try {
      const body = await req.json();
      const { name, email, password } = body;
      const cleanEmail = String(email || "").trim().toLowerCase();
      const existing = store.users.find((u: any) => u.email === cleanEmail);
      if (existing) {
        return NextResponse.json(
          { error: { message: "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।" } },
          { status: 400 }
        );
      }
      const user = {
        id: `user_${Date.now()}`,
        name: String(name || "").trim(),
        email: cleanEmail,
        password: String(password || ""),
        createdAt: new Date().toISOString(),
      };
      const session = {
        id: `sess_${Date.now()}`,
        userId: user.id,
        token: `token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      store.users.push(user);
      store.sessions.push(session);
      writeStore(store);
      const res = NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email },
        session,
      });
      res.cookies.set("better-auth.session_token", session.token, {
        path: "/",
        httpOnly: true,
        maxAge: 7*24*60*60,
      });
      return res;
    } catch {
      return NextResponse.json(
        { error: { message: "রেজিস্ট্রেশন সম্পন্ন করা যায়নি" } },
        { status: 500 }
      );
    }
  }
  if (pathname.includes("/sign-in/email")) {
    try {
      const body = await req.json();
      const { email, password } = body;
      const cleanEmail = String(email || "").trim().toLowerCase();
      const user = store.users.find(
        (u: any) => u.email === cleanEmail && u.password === String(password || ""));
      if (!user) {
        return NextResponse.json(
          { error: { message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" } },
          { status: 400 }
        );
      }
      const session = {
        id: `sess_${Date.now()}`,
        userId: user.id,
        token: `token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      store.sessions.push(session);
      writeStore(store);
      const res = NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email },
        session,
      });
      res.cookies.set("better-auth.session_token", session.token, {
        path: "/",
        httpOnly: true,
        maxAge: 7*24*60*60,
      });
      return res;
    } catch {
      return NextResponse.json(
        { error: { message: "লগইন করা যায়নি" } },
        { status: 500 }
      );
    }
  }
  if (pathname.includes("/sign-out")) {
    const res = NextResponse.json({ success: true });
    res.cookies.delete("better-auth.session_token");
    return res;
  }
  if (pathname.includes("/update-user")) {
    try {
      const body = await req.json();
      const token = req.cookies.get("better-auth.session_token")?.value;
      const sess = store.sessions.find((s: any) => s.token === token);
      if (sess) {
        const u = store.users.find((user: any) => user.id === sess.userId);
        if (u && body.name) {
          u.name = body.name;
          writeStore(store);
          return NextResponse.json({ user: u });
        }
      }
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }
  return NextResponse.json({ success: true });
}
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const store = readStore();

  if (url.pathname.includes("/get-session") || url.pathname.includes("/session")) {
    const token = req.cookies.get("better-auth.session_token")?.value;
    if (token) {
      const sess = store.sessions.find((s: any) => s.token === token);
      if (sess) {
        const user = store.users.find((u: any) => u.id === sess.userId);
        if (user) {
          return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email },
            session: sess, });
        }
      }
    }
    return NextResponse.json(null);
  }
  return NextResponse.json({ status: "ok" });
}