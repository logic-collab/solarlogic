import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolarLogic Terminal",
  description: "Financial defense for homeowners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}