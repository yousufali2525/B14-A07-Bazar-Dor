import type { Metadata } from "next";
import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import { getProducts } from "@/lib/api";
import "./globals.css";
const body = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const display = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
export const metadata: Metadata = {
  title: "বাজার দর",
  description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।",
  icons: { icon: "/logo-icon.png" },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = (await getProducts()) || [];
  return (
    <html lang="bn" data-theme="bazar">
      <body className={`${body.variable} ${display.variable} flex min-h-screen flex-col bg-base-200 font-sans`}>
        <Navbar />
        <Ticker products={products} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}