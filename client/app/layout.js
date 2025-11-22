import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { palettes } from "@/common/palettes";
import Header from "@/layout/Header";
import Toaster from "@/layout/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "Track and manage your expenses effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        style={{ background: palettes.dark[900] }}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
