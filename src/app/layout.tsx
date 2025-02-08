import type { Metadata } from "next";
import { Geist, Geist_Mono,  Press_Start_2P} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "ToDoom",
  description: "HURT ME PLENTY 💀",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart.variable} antialiased bg-[url('/franco-ferrari-original.jpg')] bg-local`}
      >
        {children}
      </body>
    </html>
  );
}
