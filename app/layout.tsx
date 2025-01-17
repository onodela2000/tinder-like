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
        url: "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='512' height='512' rx='128' fill='%23FF69B4'/%3E%3Crect x='156' y='116' width='200' height='280' rx='24' fill='white'/%3E%3Cpath d='M256 280C280 280 300 260 300 236C300 212 280 192 256 192C232 192 212 212 212 236C212 260 232 280 256 280ZM256 300C212 300 176 318 176 340V360H336V340C336 318 300 300 256 300Z' fill='%23FF69B4'/%3E%3C/svg%3E",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='512' height='512' rx='128' fill='%23FF69B4'/%3E%3Crect x='156' y='116' width='200' height='280' rx='24' fill='white'/%3E%3Cpath d='M256 280C280 280 300 260 300 236C300 212 280 192 256 192C232 192 212 212 212 236C212 260 232 280 256 280ZM256 300C212 300 176 318 176 340V360H336V340C336 318 300 300 256 300Z' fill='%23FF69B4'/%3E%3C/svg%3E",
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
