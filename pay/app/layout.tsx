import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALGOSTACK Dashboard",
  description: "Operational dashboard for payments, gas pools, and agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#212121] text-slate-100 font-inter">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
