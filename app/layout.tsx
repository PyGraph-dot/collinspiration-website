// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Open_Sans, Pacifico } from "next/font/google"
import "./globals.css"
import { ThemeContextProvider } from "@/components/providers/theme-context-provider"

// NEW IMPORTS FOR NEXT-AUTH
import NextAuthSessionProvider from '@/components/providers/next-auth-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// -----------------------------------------------------------
// ENSURE YOUR FONT DECLARATIONS ARE HERE, AT THE TOP LEVEL!
// They should be outside of any function (like RootLayout)
// -----------------------------------------------------------
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})
const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
  weight: ["400"],
})
// -----------------------------------------------------------


export const metadata: Metadata = {
  title: "Collinspiration - English Learning Books by Mr. Collins",
  description: "Premium educational resources for English language learning by Mr. Collins",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${openSans.variable} ${pacifico.variable} font-open-sans`}
      >
        <NextAuthSessionProvider session={session}>
          <ThemeContextProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeContextProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}