import Link from "next/link";
import { formatTaka } from "@/lib/bn";
import { Product } from "@/lib/types";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-base-200 text-3xl">
          {product.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-base-content/60">{product.unit}</p>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 border-t border-dashed border-base-300 pt-3">
        <div>
          <p className="text-xs text-base-content/60">আজকের দাম</p>
          <p className="font-display text-xl font-bold text-primary">{formatTaka(product.price)}</p>
        </div>
        <ChangeBadge change={product.change} />
      </div>
    </Link>
  );
}
