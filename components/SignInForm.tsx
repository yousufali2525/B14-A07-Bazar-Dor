"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";
export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("redirect") ?? "/";
  const target = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (params.get("reason") === "protected") {
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন", { id: "protected" });
    }
  }, [params]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড দিন";
      setError(message);
      toast.error(message);
      return;
    }

    if (!email.includes("@gmail.com")) {
      const message = "সঠিক জিমেইল দিন (@gmail.com সহ)";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authClient.signIn.email({ email,password,});
      if (res?.error) {
        const message = res.error.message || "ইমেইল বা পাসওয়ার্ড মেলেনি";
        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.push(target);
      router.refresh();
    } catch {
      const message = "সার্ভার সংযোগ সমস্যা";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 mx-auto">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">সাইন ইন করুন</h1>
        <p className="text-xs sm:text-sm text-slate-500">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5"> ইমেইল</label>
          <input
            name="email"
            type="email"
            placeholder="you@gmail.com"
            autoComplete="email"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5"> পাসওয়ার্ড </label>
          <input
            name="password"
            type="password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            autoComplete="current-password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs sm:text-sm text-rose-700"> {error} </p>
        )}
        <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"> {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"} </button>
      </form>
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400">অথবা</span>
      </div>
      <SocialButtons callbackURL={target} />
      <p className="text-center text-xs sm:text-sm text-slate-600"> অ্যাকাউন্ট নেই?{" "} <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700"> সাইন আপ করুন </Link></p>
      <div className="text-center pt-2">
        <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">  ← হোম পেজে ফিরে যান</Link>
      </div>
    </div>
  );
}