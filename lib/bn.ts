const banglaDigits: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};

export function toBn(value: any): string {
  if (value === undefined || value === null || value === "") return "০";
  const num = typeof value === "number" ? (isNaN(value) ? 0 : value) : value;
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
}

export function getBanglaDate(): string {
  const days = [
    "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
  ];
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const now = new Date();
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = dtf.formatToParts(now);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const dayOfWeekIndex = weekdayMap[partMap.weekday] ?? 0;
  const dayNum = parseInt(partMap.day || "1", 10);
  const monthIndex = Math.max(0, parseInt(partMap.month || "1", 10) - 1);
  const yearNum = parseInt(partMap.year || "2026", 10);

  return `${days[dayOfWeekIndex]}, ${toBn(dayNum)} ${months[monthIndex]}, ${toBn(yearNum)}`;
}