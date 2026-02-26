import NavBar from "@/app/components/NavBar"
import Footer from "./components/Footer"
import ThemeProvider from "./components/ThemeProvider"
import type { Metadata } from "next"
import { Cinzel_Decorative, Crimson_Text, Geist_Mono } from "next/font/google"
import "./globals.css"

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
})

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "KBLT — Rare Trading Cards",
  description: "Discover rare and authentic trading cards curated for serious collectors.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${cinzelDecorative.variable} ${crimsonText.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}