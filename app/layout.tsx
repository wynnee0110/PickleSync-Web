import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PickleSync | Book Courts. Smash Dinks. Play Today.",
  description:
    "Discover and instantly book premium indoor and outdoor pickleball courts in your area. Secure your court, challenge peers, and climb the club ladder.",
  keywords: [
    "pickleball",
    "pickleball court booking",
    "book pickleball court",
    "pickleball leagues and play",
    "pickleball club",
    "DUPR rating",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-[#bef264] selection:text-black">
        {children}
      </body>
    </html>
  );
}
