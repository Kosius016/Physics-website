import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";
import "katex/dist/katex.min.css";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { Analytics } from "@vercel/analytics/next";

const rubik = Rubik({
  subsets: ["cyrillic", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

const archivo = localFont({
  src: "./fonts/Archivo-Variable.ttf",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
});

const title = "SingularityLab · Физика и математика";
const description =
  "Интерактивни уроци по физика и математика — интуиция, задачи, симулации и практически материали.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "SingularityLab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" data-scroll-behavior="smooth" className={`${rubik.variable} ${archivo.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <TopNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
