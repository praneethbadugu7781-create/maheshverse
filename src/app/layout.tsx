import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Mahesh Verse | The Digital Universe of Real Estate",
    template: "%s | Mahesh Verse",
  },
  description:
    "Watch property reels, explore premium residential plots, luxury villas, apartments, and farm lands. Connect instantly with Mahesh for your next investment.",
  metadataBase: new URL("https://maheshverse.com"),
  openGraph: {
    title: "Mahesh Verse | The Digital Universe of Real Estate",
    description:
      "Watch property reels, explore premium plots, villas, and apartments. Connect instantly with Mahesh.",
    url: "https://maheshverse.com",
    siteName: "Mahesh Verse",
    locale: "en_US",
    type: "website",
    images: ["/images/rdQFRa1mkTzl4K1kOYQQFxnpWCYdac7.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahesh Verse | The Digital Universe of Real Estate",
    description: "Explore premium properties through video content. Connect instantly.",
    images: ["/images/rdQFRa1mkTzl4K1kOYQQFxnpWCYdac7.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full dark`}>
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

