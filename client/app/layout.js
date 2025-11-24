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
  title: "Ten",
  description: "Track and manage your expenses effortlessly.",
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
