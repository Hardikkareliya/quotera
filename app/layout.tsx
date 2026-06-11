import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "Quotera — Client to payment management system for SMBs",
  description:
    "Client to payment management system for SMBs. Manage clients, GST quotations, invoices, and payments in one place. Free during early access.",
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
        <SpeedInsights />
      </body>
    </html>
  );
}
