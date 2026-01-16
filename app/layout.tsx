import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biathlon World Cup Tracker",
  description: "Suivez les compétitions de biathlon de la Coupe du Monde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
