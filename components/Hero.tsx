import Image from "next/image";

function getBanglaDate(): string {
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const banglaDigits: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = String(now.getDate()).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
  const monthName = months[now.getMonth()];
  const yearNum = String(now.getFullYear()).replace(/[0-9]/g, (d) => banglaDigits[d] || d);
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}

export default function Hero() {
  const banglaDate = getBanglaDate();

  return (
    <div className="bg-[#f2f7f4] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex-1 text-left">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-xs font-semibold mb-4">
              {banglaDate}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl font-normal">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-6 sm:mt-8">
              <a
                href="#সব-পণ্য"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-medium text-sm shadow-[0_2px_8px_rgba(5,150,105,0.25)] transition-colors"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 w-64 sm:w-80 md:w-96 flex items-center justify-center">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর"
              width={380}
              height={300}
              priority
              className="w-full h-auto object-contain select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}