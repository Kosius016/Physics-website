import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { Analytics } from "@vercel/analytics/next";

const rubik = Rubik({
  subsets: ["cyrillic", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STEM Платформа · Физика",
  description: "Интерактивни уроци по физика — мотивация, интуиция, математика, симулации.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" data-scroll-behavior="smooth" className={rubik.variable}>
      <body className="min-h-screen font-sans antialiased">
        <TopNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
