import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mystry Message",
  description: "Dive into the World of Anonymous Feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
