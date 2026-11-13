import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openassay-research.aa-04.chatgpt.site"),
  title: "OpenAssay — Curiosity, put to work.",
  description: "A new research engine. 100+ NeurIPS papers reproduced with code. Launching soon—join the OpenAssay waitlist.",
  openGraph: {
    title: "OpenAssay — Curiosity, put to work.",
    description: "A new research engine. A collection of 100+ NeurIPS papers reproduced with code. Join the waitlist for what comes next.",
    type: "website",
    locale: "en_US",
    siteName: "OpenAssay",
  },
  twitter: { card: "summary", title: "OpenAssay — Curiosity, put to work.", description: "A new research engine. Launching soon." },
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
