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
  title: "Kobold's Tavern — Yours true and only real TCG tavern",
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
          {/*
            pt-[72px] compensates for the fixed navbar height so no page
            content is hidden behind it. Hero overrides this with its own
            pt-24 for the extra breathing room the hero section needs.
          */}
          <div className="pt-[72px]">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}