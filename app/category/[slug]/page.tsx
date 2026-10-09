"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getCategory, getProducts } from "@/lib/api";
import { toBn } from "@/lib/bn";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          getCategory(slug),
          getProducts(slug),
        ]);
        setCategory(catData);
        setProducts(prodData || []);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
    if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
    return 0;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 animate-pulse">
        <div className="h-28 bg-white rounded-2xl border border-slate-200" />
        <div className="h-14 bg-white rounded-2xl border border-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-36 bg-white rounded-2xl border border-slate-200" />
          <div className="h-36 bg-white rounded-2xl border border-slate-200" />
          <div className="h-36 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (!category && products.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">এই ক্যাটাগরিতে কোনো পণ্য নেই</h2>
        <p className="text-sm text-slate-500 mb-6">ক্যাটাগরিটি সঠিক নয় অথবা পণ্য এখনো যোগ করা হয়নি।</p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-inner">
          {category?.icon || "🛒"}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {category?.name || slug}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-3.5 shadow-sm flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-500 font-medium">সাজান:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-3 px-1">
          মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id || p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}