import { Fraunces, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bank Sampah Digital — Buku Tabungan Sampah Warga",
  description:
    "Sistem digital pencatatan setoran sampah, poin, dan saldo nasabah bank sampah.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${spaceMono.variable} ${inter.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
