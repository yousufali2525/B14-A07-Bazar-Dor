export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="text-base-content/80">
          <span className="font-display text-lg font-bold text-primary">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p className="text-base-content/60 md:text-right">  সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়। </p>
      </div>
    </footer>
  );
}
