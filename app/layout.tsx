import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Simulador Copa 2026",
  description: "Monte seu chaveamento oficial e simule quem vai levantar a taça da Copa do Mundo!",
  manifest: "/manifest.json", // <-- AVISA PRO NEXT.JS QUE É UM APP
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Copa 2026",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
