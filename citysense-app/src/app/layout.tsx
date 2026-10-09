import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CitySense | Smart Urban Exploration & Safety Navigator",
  description: "Navigate urban chaos with real-time safety scores, hidden culinary gems, historic landmarks, and AI-powered safe route intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
