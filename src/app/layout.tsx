import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpotifyAuthProvider } from "./context/SpotifyAuthContext";
import SpotifyProviders from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Data Dashboard",
  description: "Explore Spotify's music data and control playback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpotifyProviders>
          <SpotifyAuthProvider>{children}</SpotifyAuthProvider>
        </SpotifyProviders>
      </body>
    </html>
  );
}
