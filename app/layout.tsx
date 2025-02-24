import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CEDA Agri Market Data",
  description: "Explore daily, monthly and yearly agricultural commodity prices and arrivals from government-regulated markets (mandis) in India, compiled by the Ministry of Agriculture and Farmers Welfare. Visualize price trends and quantity arrivals at national, state, and district levels, with heat maps and downloadable datasets mapped to Census 2011 boundaries",
  keywords: [
    "Agmarknet",
    "agricultural data India",
    "mandi prices",
    "commodity prices India",
    "price trends visualization",
    "quantity arrivals data",
    "Ministry of Agriculture India",
    "state-level agricultural data",
    "district-level price data",
    "agricultural market analysis",
    "mandi arrivals",
    "agri market data",
    "India agriculture statistics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
