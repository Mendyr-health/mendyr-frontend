import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mendyr — Home Healthcare, Reimagined",
    template: "%s | Mendyr",
  },
  description:
    "Connecting patients with verified nurses and caregivers for premium at-home healthcare services. Join the waitlist today.",
  keywords: [
    "home healthcare",
    "nursing services",
    "home nursing",
    "elder care",
    "physiotherapy at home",
    "patient care",
    "verified nurses",
    "Mendyr",
  ],
  authors: [{ name: "Mendyr" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Mendyr",
    title: "Mendyr — Home Healthcare, Reimagined",
    description:
      "Connecting patients with verified nurses and caregivers for premium at-home healthcare services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mendyr — Home Healthcare, Reimagined",
    description:
      "Connecting patients with verified nurses and caregivers for premium at-home healthcare services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F7F9FC",
};

import { StoreProvider } from "@/store/StoreProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { NativeAppBootstrap } from "@/components/NativeAppBootstrap";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NativeAppBootstrap />
        <I18nProvider>
          <StoreProvider>{children}</StoreProvider>
        </I18nProvider>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
      {GA_ID && GA_ID !== "G-XXXXXXXXXX" && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
