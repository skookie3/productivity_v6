import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Focus",
  description: "Gérez vos habitudes, tâches et sessions Pomodoro",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
