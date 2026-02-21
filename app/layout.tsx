import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import ShoppingCart from "@/components/ShoppingCart"
import DesktopNavbar from "@/components/DesktopNavbar"
import MobileMenu from "@/components/MobileMenu"
import CookieConsent from "@/components/CookieConsent"
import ChatbotsPromoBanner from "@/components/ChatbotsPromoBanner"
import ValentinePopup from "@/components/ValentinePopup"
import WelcomeModal from "@/components/WelcomeModal"
import PremiumAppsAnnouncement from "@/components/PremiumAppsAnnouncement"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Codex tech by ANONYMIKETECH",
  description: "EXPLORE-DEVELOP-INOVATE",
  generator: "ANONYMIKETECH",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Valentine Love Messages - Quick Access */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.valentineLinks = {
              create: '/valentine',
              view: '/valentine/view'
            };`,
          }}
        />
      </head>
      <body className={`font-sans antialiased ${_geist.className}`}>
        <CartProvider>
          <ValentinePopup />
          <DesktopNavbar />
          <MobileMenu />
          {children}
          <ShoppingCart />
          <CookieConsent />
          <ChatbotsPromoBanner />
          <WelcomeModal />
          <PremiumAppsAnnouncement />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
