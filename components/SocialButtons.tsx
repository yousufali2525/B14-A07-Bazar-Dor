"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function SocialButtons({ callbackURL = "/" }: { callbackURL?: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const handleSocialLogin = async (provider: "google" | "github") => {setLoading(provider);
  const providerName = provider === "google" ? "Google" : "GitHub";
    try {
      const res = await authClient.signIn.social({ provider: provider, callbackURL: callbackURL,});
      if (res?.error) {
        toast.error(res.error.message || `${providerName} ক্লায়েন্ট আইডি সেট করা নেই। ইমেইল দিয়ে প্রবেশ করুন।`);
      }
    } catch {
      toast.error(`${providerName} সংযোগে সমস্যা হয়েছে`);
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleSocialLogin("google")}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
        <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
          <path
            fill="#FBBC05"
            d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        <span>{loading === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}</span>
      </button>
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleSocialLogin("github")}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
        <svg className="h-4 w-4 fill-current text-slate-800" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a10.9 10.9 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        <span>{loading === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে চালিয়ে যান"}</span>
      </button>
    </div>
  );
}