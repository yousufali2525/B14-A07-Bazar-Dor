# 🛒 বাজার দর (BazarDor)

প্রতিদিনের নিত্যপণ্যের দাম এক নজরে দেখার একটি রেসপন্সিভ ওয়েব অ্যাপ। চাল, ডাল, সবজি, মাছ ও মাংসের আজকের দাম, আগের দিনের তুলনায় বাড়া-কমা এবং বিভিন্ন বাজারের দামের তুলনা এক জায়গায়।

## Technologies Used

| Technology | Purpose |
| --- | --- |
| Next.js (App Router) | UI তৈরি ও পেজ নেভিগেশন |
| TypeScript | টাইপ-সেফ ডেভেলপমেন্ট |
| Tailwind CSS + DaisyUI | স্টাইলিং ও রেসপন্সিভ ডিজাইন |
| BetterAuth | Email/Password, Google ও GitHub অথেন্টিকেশন |
| MongoDB | ইউজার ও সেশন ডেটা |
| react-hot-toast | টোস্ট নোটিফিকেশন |

## Key Features

1. **লাইভ প্রাইস টিকার** — নেভবারের নিচে অসীম স্ক্রলিং স্ট্রিপে ইমোজি, নাম, দাম ও ▲/▼ শতকরা পরিবর্তন।
2. **আজ কী বাড়ল, কী কমল** — সর্বাধিক দাম বাড়া ও কমা ৬টি করে পণ্য আলাদা সেকশনে।
3. **ক্যাটাগরি পেজ ও সর্টিং** — দাম অনুযায়ী ডিফল্ট / কম থেকে বেশি / বেশি থেকে কম সাজানো, বাংলা সংখ্যা সঠিকভাবে সংখ্যামান ধরে।
4. **প্রোটেক্টেড পণ্য বিবরণ** — লগইন করলে সর্বনিম্ন, সর্বোচ্চ, গড় ও বাজারভিত্তিক দামের বিস্তারিত।
5. **BetterAuth লগইন** — ইমেইল/পাসওয়ার্ড, Google ও GitHub, প্রতিটি ধাপে টোস্ট।
6. **প্রোফাইল আপডেট** — নাম বদলানোর ফর্ম।
7. **স্কেলেটন লোডিং, কাস্টম ৪০৪ ও পূর্ণ রেসপন্সিভ লেআউট**।

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`-এ `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` এবং সোশ্যাল লগইনের ক্লায়েন্ট আইডি/সিক্রেট দিন।

## OAuth Callback URLs

- Google: `{BETTER_AUTH_URL}/api/auth/callback/google`
- GitHub: `{BETTER_AUTH_URL}/api/auth/callback/github`

## Deployment

Vercel-এ ইমপোর্ট করে `.env.example`-এর সব ভ্যারিয়েবল Environment Variables-এ যোগ করুন এবং `BETTER_AUTH_URL`-এ ডিপ্লয় করা URL দিন।
