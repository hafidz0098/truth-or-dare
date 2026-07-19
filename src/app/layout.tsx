import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Truth or Dare Party — Premium Multiplayer Game",
  description:
    "Truth or Dare buat main bareng teman, pasangan, atau keluarga. Putar roda, pilih kartu, selesai.",
  applicationName: "Truth or Dare Party",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ToD Party",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Truth or Dare Party",
    description: "Truth or Dare — main bareng, putar roda, pilih kartu",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0b1020] text-white">
        {children}
      </body>
    </html>
  );
}
