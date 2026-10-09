import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getProduct } from "@/lib/api";
import { toBn } from "@/lib/bn";
import NotFoundView from "@/components/NotFoundView";

const categoryMap: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dui": "ডিম-দুধ",
  "dim-dudh": "ডিম-দুধ",
  dim: "ডিম",
  mosla: "মসলা",
  moshla: "মসলা",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await requireSession(`/product/${slug}`);

  const product = await getProduct(slug);

  if (!product) {
    return (
      <NotFoundView
        title="পণ্যটি পাওয়া যায়নি"
        message="আপনি যে পণ্যটি খুঁজছেন তা বাজারে অন্তর্ভুক্ত নেই অথবা লিংকটি ভুল।"
      />
    );
  }

  const markets = (product.markets || []) as Array<{
    name: string;
    division?: string;
    min?: number;
    max?: number;
    price?: number;
  }>;

  const todayPrice = Number(product.price) || 0;
  const yesterdayPrice = Number(product.yesterday) || todayPrice;
  const priceDiff = Math.abs(todayPrice - yesterdayPrice);

  const changeVal = Number(product.change) || 0;
  const isUp = changeVal > 0 || todayPrice > yesterdayPrice;
  const isDown = changeVal < 0 || todayPrice < yesterdayPrice;
  const pctStr = toBn(Math.abs(changeVal).toFixed(1));

  let diffText = "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  if (isUp && priceDiff > 0) {
    diffText = `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBn(priceDiff)} টাকা`;
  } else if (isDown && priceDiff > 0) {
    diffText = `গতকালের তুলনায় আজ দাম কমেছে · ${toBn(priceDiff)} টাকা`;
  }

  const unitClean = product.unit ? product.unit.replace("প্রতি ", "") : "কেজি";

  const allMins = markets.map((m) => m.min || m.price || 0).filter((p) => p > 0);
  const allMaxs = markets.map((m) => m.max || m.price || 0).filter((p) => p > 0);

  const minPrice = allMins.length ? Math.min(...allMins) : Number(product.min) || todayPrice;
  const maxPrice = allMaxs.length ? Math.max(...allMaxs) : Number(product.max) || todayPrice;
  const avgPrice =
    Number(product.avg) ||
    (allMins.length && allMaxs.length
      ? Math.round(
          (allMins.reduce((a, b) => a + b, 0) + allMaxs.reduce((a, b) => a + b, 0)) /
            (allMins.length + allMaxs.length)
        )
      : todayPrice);

  const formatAvg = (min: number, max: number) => {
    const avg = (min + max) / 2;
    const str = avg % 1 === 0 ? String(avg) : avg.toFixed(2);
    return `${toBn(str)} টাকা`;
  };

  const categoryBn =
    (product.category && categoryMap[product.category.toLowerCase().trim()]) ||
    product.category ||
    "নিত্যপণ্য";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        হোম পেজে ফিরে যান
      </Link>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-[#f2f5f3] text-3xl sm:text-4xl select-none">
            {product.emoji || "🛒"}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal">
              {product.unit} · {categoryBn}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal">
              {diffText}
            </p>
          </div>
        </div>

        <div className="bg-[#f4f7f5] rounded-2xl py-3.5 px-6 sm:px-8 text-center min-w-[130px] sm:min-w-[150px] self-start sm:self-center">
          <span className="block text-xs text-slate-400 font-medium">
            আজকের দাম
          </span>
          <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 mt-0.5 tracking-tight leading-none">
            {toBn(todayPrice)}
          </span>
          <span className="block text-xs text-slate-500 font-medium mt-1">
            টাকা / {unitClean}
          </span>
          <div className="mt-1">
            {isUp && (
              <span className="text-rose-600 font-bold text-xs inline-flex items-center gap-0.5">
                ▲ {pctStr}%
              </span>
            )}
            {isDown && (
              <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-0.5">
                ▼ {pctStr}%
              </span>
            )}
            {!isUp && !isDown && (
              <span className="text-slate-400 font-medium text-xs">
                — ০.০%
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3.5">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="block text-xs font-medium text-slate-500">
              সর্বনিম্ন দাম
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {toBn(minPrice)} টাকা
            </p>
            <span className="block text-xs text-slate-400 mt-1 font-normal">
              সবচেয়ে কম দামের বাজার
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="block text-xs font-medium text-slate-500">
              সর্বাধিক দাম
            </span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">
              {toBn(maxPrice)} টাকা
            </p>
            <span className="block text-xs text-slate-400 mt-1 font-normal">
              সবচেয়ে বেশি দামের বাজার
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="block text-xs font-medium text-slate-500">
              গড় দাম
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {toBn(avgPrice)} টাকা
            </p>
            <span className="block text-xs text-slate-400 mt-1 font-normal">
              প্রতি {unitClean}-এর হিসাবে
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3.5">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            এই পণ্যের জন্য আলাদা বাজার তালিকা পাওয়া যায়নি।
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs">
                    <th className="py-4 px-6 font-medium">বাজার</th>
                    <th className="py-4 px-6 font-medium">বিভাগ</th>
                    <th className="py-4 px-6 text-right font-medium">সর্বনিম্ন</th>
                    <th className="py-4 px-6 text-right font-medium">সর্বাধিক</th>
                    <th className="py-4 px-6 text-right font-medium">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {markets.map((m, idx) => {
                    const min = m.min || m.price || 0;
                    const max = m.max || m.price || 0;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-slate-900">
                          {m.name}
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">
                          {m.division || "বাংলাদেশ"}
                        </td>
                        <td className="py-3.5 px-6 text-right text-slate-700 font-normal">
                          {toBn(min)} টাকা
                        </td>
                        <td className="py-3.5 px-6 text-right text-slate-700 font-normal">
                          {toBn(max)} টাকা
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                          {formatAvg(min, max)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}