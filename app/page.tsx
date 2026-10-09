import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { toBn } from "@/lib/bn";

export default async function HomePage() {
  const products = (await getProducts()) || [];

  const risers = products
    .filter((p) => {
      const c = Number(p.change);
      if (!isNaN(c) && c > 0) return true;
      if (p.today && p.yesterday && p.today > p.yesterday) return true;
      return false;
    })
    .sort((a, b) => Number(b.change) - Number(a.change))
    .slice(0, 6);

  const fallers = products
    .filter((p) => {
      const c = Number(p.change);
      if (!isNaN(c) && c < 0) return true;
      if (p.today && p.yesterday && p.today < p.yesterday) return true;
      return false;
    })
    .sort((a, b) => Number(a.change) - Number(b.change))
    .slice(0, 6);

  return (
    <div className="space-y-12 pb-20">
      <Hero />

      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-rose-600 text-lg">▲</span>
              <span>আজ দাম বেড়েছে</span>
            </h2>
          </div>

          {risers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {risers.map((p) => (
                <ProductCard key={`riser-${p.id || p.slug}`} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              আজ কোনো পণ্যের দাম বাড়েনি।
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-600 text-lg">▼</span>
              <span>আজ দাম কমেছে</span>
            </h2>
          </div>

          {fallers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fallers.map((p) => (
                <ProductCard key={`faller-${p.id || p.slug}`} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              আজ কোনো পণ্যের দাম কমেনি।
            </div>
          )}
        </section>

        <section id="সব-পণ্য" className="scroll-mt-24 pt-2">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              সব পণ্য
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={`all-${p.id || p.slug}`} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              এই মুহূর্তে পণ্যের তথ্য লোড করা যায়নি।
            </div>
          )}
        </section>
      </div>
    </div>
  );
}