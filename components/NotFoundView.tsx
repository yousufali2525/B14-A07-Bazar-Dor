import Link from "next/link";

export default function NotFoundView({
  title = "পাতাটি খুঁজে পাওয়া যায়নি",
  message = "আপনি যে পাতাটি খুঁজছেন সেটি নেই অথবা সরিয়ে নেওয়া হয়েছে।",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-primary/30">৪০৪</p>
      <h1 className="mt-2 font-display text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-base-content/60">{message}</p>
      <Link href="/" className="btn btn-primary mt-6 rounded-full px-8">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
