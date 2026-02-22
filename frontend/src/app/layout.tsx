import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SafeSurf | Modern Cybersecurity Awareness",
  description: "Learn to spot phishing attacks and master cyber hygiene with confidence. Interactive cybersecurity awareness for everyone.",
  keywords: ["cybersecurity", "phishing", "education", "online safety", "cyber hygiene"],
  authors: [{ name: "SafeSurf Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} font-sans antialiased text-slate-900`}>
        {children}
      </body>
    </html>
  );
}

