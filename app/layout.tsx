import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";

import { AppToaster } from "@/components/app-toaster";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlexHub — Business OS for Indian freelancers & SMBs",
  description:
    "Manage clients, GST quotations, invoices, and payments in one place. Early access open — use code LAUNCH2026 for 3 months free.",
  icons: {
    icon: "/brand/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${outfit.variable} min-h-screen font-sans antialiased`}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
