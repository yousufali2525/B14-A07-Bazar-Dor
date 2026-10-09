"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";
import toast from "react-hot-toast";

function getBanglaDate(): string {
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const banglaDigits: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = String(now.getDate()).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
  const monthName = months[now.getMonth()];
  const yearNum = String(now.getFullYear()).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const banglaDate = getBanglaDate();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          const apiCategories = data.filter((c) => c.slug !== "all");
          setCategories(apiCategories);
        }
      } catch (err) {
        console.error("ক্যাটাগরি ফেচ করতে ব্যর্থ:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setMenuOpen(false);
      await signOut();
      toast.success("সফলভাবে সাইন আউট করা হয়েছে");
      window.location.href = "/";
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const displayName = session?.user?.name || "ব্যবহারকারী";
  const firstName = displayName.split(" ")[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 select-none group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  বাজার দর
                </span>
                
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {banglaDate}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline-block font-semibold text-sm text-slate-800 max-w-[120px] truncate">
                    {firstName}
                  </span>
                  <span className="text-slate-400 text-xs">▾</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 z-50">
                    <div className="pb-3 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="pt-3 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 rounded-xl transition-colors"
                      >
                        <span className="text-blue-600 text-sm">👤</span>
                        <span>আমার প্রোফাইল</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <span className="text-rose-600 text-sm">↩</span>
                        <span>সাইন আউট</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-start gap-2.5 sm:gap-6 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-medium">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                    isActive
                      ? "bg-emerald-600 text-white font-semibold shadow-sm"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}