const banglaDigits: Record<string, string> = { "0": "০","1": "১","2": "২","3": "৩","4": "৪","5": "৫","6": "৬","7": "৭","8": "৮","9": "৯",};
export function toBn(value: any): string {
  if (value === undefined || value === null || value === "") return "০";
  const num = typeof value === "number" ? (isNaN(value) ? 0 : value) : value;
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
}
export function formatTaka(value: any): string {
  if (value === undefined || value === null || value === "") return "০ টাকা";
  return `${toBn(value)} টাকা`;
}
export function parseNum(value: any): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const bnToEnMap: Record<string, string> = {"০": "0","১": "1","২": "2","৩": "3","৪": "4","৫": "5","৬": "6","৭": "7","৮": "8","৯": "9",};
  const clean = String(value).replace(/[০-৯]/g, (d) => bnToEnMap[d] || d).replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
export function getBanglaDate(): string {
  const days = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার",];
  const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর",];
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = toBn(now.getDate());
  const monthName = months[now.getMonth()];
  const yearNum = toBn(now.getFullYear());
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}
export function toCategoryBn(cat: string | undefined): string {
  if (!cat) return "নিত্যপণ্য";
  const map: Record<string, string> = {chal: "চাল",dal: "ডাল",tel: "তেল",sobji: "সবজি",mach: "মাছ",mangsho: "মাংস","dim-dui": "ডিম-দুধ","dim-dudh": "ডিম-দুধ",dim: "ডিম", mosla: "মসলা", moshla: "মসলা", all: "সব পণ্য",};
  return map[cat.toLowerCase().trim()] || cat;
}