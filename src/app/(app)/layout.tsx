import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Mystery Message — Anonymous Feedback",
    template: "%s | Mystery Message",
  },
  description:
    "Send and receive anonymous feedback with Mystery Message. Your identity stays secret while you share honest thoughts.",
  keywords: [
    "anonymous messaging",
    "anonymous feedback",
    "mystery message",
    "secret messages",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mystery Message",
    title: "Mystery Message — Anonymous Feedback",
    description:
      "Send and receive anonymous feedback. Your identity stays a secret.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Message — Anonymous Feedback",
    description:
      "Send and receive anonymous feedback. Your identity stays a secret.",
  },
  icons: {
    icon: "/favicon.svg", // or /icon.png
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className={`${poppins.className} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
