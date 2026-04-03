/**
 * Root layout for the QBO Lookup application.
 */

// External Modules ----------------------------------------------------------

import "@repo/daisy-ui/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// Attempt to avoid pre-rendering on pages that do Prisma calls -- breaks on GitHub Actions
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daisy Showcase",
  description: "Example components with DaisyUI and React Aria Components",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
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
