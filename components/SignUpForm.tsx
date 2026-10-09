"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fail = (message: string) => {
    setError(message);
    toast.error(message);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!name || !email || !password || !confirmPassword) {
      return fail("সবগুলো ঘর পূরণ করুন");
    }
    if (password.length < 8) {
      return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    }
    if (password !== confirmPassword) {
      return fail("পাসওয়ার্ড দুটি মেলেনি");
    }

    setLoading(true);
    setError("");

    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (res?.error) {
        setLoading(false);
        return fail(res.error.message || "রেজিস্ট্রেশন করা যায়নি");
      }

      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে, এবার সাইন ইন করুন");
      router.push("/signin");
    } catch {
      fail("সার্ভারে সংযোগ করা যায়নি। ডাটাবেজ এবং ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 mx-auto">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            নাম
          </label>
          <input
            name="name"
            type="text"
            placeholder="যেমন: রহিম উদ্দিন"
            autoComplete="name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ইমেইল
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            পাসওয়ার্ড
          </label>
          <input
            name="password"
            type="password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="আবার লিখুন"
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs sm:text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400">অথবা</span>
      </div>

      <SocialButtons callbackURL="/" />

      <p className="text-center text-xs sm:text-sm text-slate-600">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="font-semibold text-emerald-600 hover:text-emerald-700">
          সাইন ইন করুন
        </Link>
      </p>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}