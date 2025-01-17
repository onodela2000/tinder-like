import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "マッチングアプリ",
  description: "素敵な出会いを見つけましょう",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='512' height='512' rx='128' fill='%236C5CE7'/%3E%3Crect x='128' y='176' width='200' height='280' rx='24' transform='rotate(-15 128 176)' fill='white'/%3E%3Crect x='184' y='156' width='200' height='280' rx='24' transform='rotate(15 184 156)' fill='rgba(255,255,255,0.9)'/%3E%3C/svg%3E",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='512' height='512' rx='128' fill='%236C5CE7'/%3E%3Crect x='128' y='176' width='200' height='280' rx='24' transform='rotate(-15 128 176)' fill='white'/%3E%3Crect x='184' y='156' width='200' height='280' rx='24' transform='rotate(15 184 156)' fill='rgba(255,255,255,0.9)'/%3E%3C/svg%3E",
        sizes: "512x512"
      }
    ]
  },
  manifest: "/manifest.json",
  themeColor: "#6C5CE7",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
