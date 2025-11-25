import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { palettes } from "@/common/palettes";
import Main from "@/layout/main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // --- Basic Metadata ---
  title: "FinX",
  description: "Track and manage your expenses effortlessly.",

  // --- Open Graph (OG) Metadata (For Facebook, LinkedIn, etc.) ---
  openGraph: {
    title: "FinX - Expense Tracker",
    description: "Easily track, manage, and visualize your personal finances with Flow. Achieve financial clarity today.",
    url: "/logo2.png", // Replace with your app's actual URL
    siteName: "FinX",
    images: [
      {
        url: "/logo2.png", // Path to your 1200x630px social preview image
        width: 1200,
        height: 630,
        alt: "FinX Expense Tracker App Dashboard Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // --- Twitter Metadata ---
  twitter: {
    card: "summary_large_image", // Recommended for better visual appeal
    title: "FinX: Effortless Expense Tracking",
    description: "Get financial clarity. Track every expense, visualize your budget, and save money with the Flow app.",
    creator: "@YOUR_TWITTER_HANDLE", // Replace with your app's Twitter handle
    images: ["/twitter-image.jpg"], // Path to your 800x418px Twitter preview image
  },
};

export default function RootLayout({ children, ...props }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        style={{ background: '#0f172a' }}
      >
        <Main children={children} props={props} />
      </body>
    </html>
  );
}
