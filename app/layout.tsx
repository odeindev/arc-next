// app/layout.tsx
import type { Metadata } from "next";
import { Mulish, Chakra_Petch } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arc Web",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={mulish.className} suppressHydrationWarning>
      <body className="antialiased bg-black">
        <ClientLayout>{children}</ClientLayout>
        <strong className={chakraPetch.className}></strong>
      </body>
    </html>
  );
}
