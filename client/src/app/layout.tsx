import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VedaAI - AI Assessment Creator",
  description: "Create AI-powered question papers and assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">
        <Providers>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
