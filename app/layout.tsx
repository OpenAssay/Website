import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openassay.ca"),
  alternates: { canonical: "https://openassay.ca/" },
  title: "OpenAssay — Research engine",
  description: "A research engine for efficient, traceable research from a single prompt. 20+ paper reproductions from 2026 A* conferences. All code and papers will be released.",
  openGraph: {
    title: "OpenAssay — Research engine",
    description: "Token and compute efficiency, traceable research, and 20+ reproductions from 2026 A* conferences. All code and papers will be released.",
    type: "website",
    locale: "en_US",
    siteName: "OpenAssay",
    url: "https://openassay.ca/",
  },
  twitter: { card: "summary", title: "OpenAssay — Research engine", description: "Efficient, traceable research from a single prompt. 20+ reproductions from 2026 A* conferences. All code and papers will be released." },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
