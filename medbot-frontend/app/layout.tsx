import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedBot - Medical Voice Transcription",
  description: "AI-powered medical voice transcription assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

