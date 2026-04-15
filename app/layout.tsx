import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { esEs } from "@clerk/localizations";

import { EdgeStoreProvider } from "@/lib/edgestore";

import "./globals.css";//corregir esto 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kraft",
  description: "Donde tus ideas toman forma",
  icons:{
    icon:[
      {
        media: "(prefers-color-scheme: light)",
        url: "/kraftLogo.ico",
        type: "image/x-icon"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/kraftLogo.ico",
        type: "image/x-icon"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="kraft-theme-2"
          >
            <Toaster position="bottom-center"/>
            <ModalProvider/>
            {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
