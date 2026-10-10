import { toBn } from "@/lib/bn";
export default function ChangeBadge({ change }: { change: number }) {
  const val = Number(change) || 0;
  const isUp = val > 0;
  const isDown = val < 0;
  const absPct = toBn(Math.abs(val).toFixed(1));
  if (isUp) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
        <span className="text-[10px]">▲</span>+{absPct}% </span> );
  }
  if (isDown) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
        <span className="text-[10px]">▼</span> -{absPct}%</span>);
  }
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/60">
      <span>—</span>  ০.০% </span>
  );
}