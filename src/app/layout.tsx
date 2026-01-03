import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteFlow | Secure Digital Voting System",
  description: "A premium, secure, and transparent digital voting platform for institutions and organizations. Experience the future of democratic decision-making.",
  keywords: ["voting", "digital democracy", "secure election", "VoteFlow", "online voting"],
  authors: [{ name: "VoteFlow Team" }],
  viewport: "width=device-width, initial-scale=1",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

