import React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "UPSC with Eshwar | India's Premium UPSC Platform",
  description: "India's most premium ecosystem for UPSC preparation.",
};

import { SmartPopups } from "@/components/layout/SmartPopups";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background`}>
        <Providers>
          <SmartPopups />
          {children}
        </Providers>
      </body>
    </html>
  );
}
