"use client";
import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import ProductGrid from "./ProductGrid";
type SortKey = "default" | "asc" | "desc";
export default function SortedProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("default");
  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-3">
        <label htmlFor="sort" className="text-sm font-medium text-base-content/70"> সাজান: </label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select select-bordered select-sm sm:select-md appearance-none rounded-full bg-base-100 pr-10">
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
      <ProductGrid products={sorted} />
    </div>
  );
}
