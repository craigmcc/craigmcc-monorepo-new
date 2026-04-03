/**
 * Root layout for the QBO Lookup application.
 */

// External Modules ----------------------------------------------------------

import "@repo/daisy-ui/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import React from "react";
import { isRTL } from "react-aria-components";

// Internal Modules ----------------------------------------------------------

import { Providers } from "@/app/providers";

// Public Objects ------------------------------------------------------------

// Attempt to avoid pre-rendering on pages that do Prisma calls -- breaks on GitHub Actions
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daisy Showcase",
  description: "Example components with DaisyUI and React Aria Components",
};

export default async function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = (await headers()).get('accept-language');
  const lang = acceptLanguage?.split(/[,;]/)[0] || 'en-US';
  return (
    <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'}>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Providers lang={lang}>
        {children}
      </Providers>
    </body>
    </html>
  );
}


// Private Objects -----------------------------------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
