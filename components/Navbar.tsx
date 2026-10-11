"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";
import { getBanglaDate } from "@/lib/bn";
import toast from "react-hot-toast";

export default function Navbar({
  categories: initialCategories,
}: {
  categories?: Category[];
} = {}) {
  const pathname = usePathname();

  const [banglaDate, setBanglaDate] = useState<string>("");
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || []
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [session?.user?.image]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories.filter((c) => c.slug !== "all"));
      return;
    }
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
  }, [initialCategories]);

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                {banglaDate || "আজকের বাজার দর"}
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
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-emerald-700 border border-slate-200 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {session.user.image && !imageError ? (
                      <img
                        src={session.user.image}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span>{firstName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                    {firstName}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 pb-8 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug truncate">
                        {displayName}
                      </h4>
                      <p className="text-sm text-slate-500 leading-normal truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="mt-5 space-y-3.5">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 text-[15px] font-medium text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer w-full"
                      >
                        <span className="text-base leading-none select-none">
                          👤
                        </span>
                        <span>আমার প্রোফাইল</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 text-[15px] font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer w-full text-left"
                      >
                        <span className="text-base leading-none select-none font-bold">
                          ↩
                        </span>
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
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ক্যাটাগরি বার */}
      <div className="bg-slate-50/80 border-t border-b border-slate-200/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600 font-semibold"
                      : "bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-medium"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform group-hover:scale-110 ${
                      isActive ? "bg-white/20" : "bg-slate-100"
                    }`}
                  >
                    {cat.icon}
                  </span>
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