import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qadim — The Memory of Lebanon",
  description: "Verify any Lebanese or Phoenician historical, political, or cultural claim across thousands of years with AI-powered research and verified sources.",
  keywords: ["Lebanon", "Phoenician", "history", "culture", "AI", "research", "verification"],
  authors: [{ name: "Qadim Team" }],
  openGraph: {
    title: "Qadim — The Memory of Lebanon",
    description: "AI-powered research for Lebanese and Phoenician history",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}