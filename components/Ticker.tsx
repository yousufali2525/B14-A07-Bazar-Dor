"use client";
import { Product } from "@/lib/types";
import { toBn } from "@/lib/bn";
export default function Ticker({ products }: { products: Product[] }) {
  const items = products && products.length > 0 ? products : [];
  const looped = [...items, ...items, ...items];
  return (
    <div className="relative w-full bg-[#fbfcfb] border-y border-slate-200/80 overflow-hidden select-none py-2 shadow-sm">
      <style>{` @keyframes slowMarquee {  0% { transform: translateX(0%); }  100% { transform: translateX(-33.33%); } } .ticker-track { animation: slowMarquee 60s linear infinite;}.ticker-track:hover { animation-play-state: paused;}`}</style>
      <div className="flex w-max items-center ticker-track">
        {looped.map((item, idx) => {
          const changeVal = Number(item.change) || 0;
          const isUp = changeVal > 0;
          const isDown = changeVal < 0;
          const absPct = toBn(Math.abs(changeVal).toFixed(1));
          const unitStr = (item.unit || "কেজি").replace("প্রতি ", "");
          return (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-2 px-5 border-r border-slate-200/80 whitespace-nowrap text-xs sm:text-sm text-slate-800">
              <span className="text-base">{item.emoji || "🛒"}</span>
              <span className="font-semibold text-slate-900">{item.name}</span>
              <span className="text-slate-700">
                {toBn(item.price)} টাকা/{unitStr}
              </span>

              {isUp && (
                <span className="font-bold text-rose-600 inline-flex items-center gap-0.5"> ▲ {absPct}% </span> )}
              {isDown && (
                <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5"> ▼ {absPct}% </span>)}
              {!isUp && !isDown && (
                <span className="font-medium text-slate-400 inline-flex items-center gap-0.5">  — ০.০% </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}