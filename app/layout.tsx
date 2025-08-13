import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockSight",
  description:
    "Track live stock prices and trends with a clean, professional dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
