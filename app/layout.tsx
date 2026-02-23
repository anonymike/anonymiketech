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
  metadataBase: new URL("https://anonymiketech.com"),
  title: "ANONYMIKETECH | Web Development, AI Chatbots & Internet Services in Kenya",
  description: "Professional web development, AI-powered chatbots, internet services, and social media marketing solutions. Expert tech services in Nairobi, Kenya. Explore our premium apps and innovation.",
  keywords: ["web development", "AI chatbots", "internet services", "Kenya", "Nairobi", "VPN services", "web design", "React", "Next.js", "premium apps"],
  generator: "ANONYMIKETECH",
  authors: [{ name: "ANONYMIKETECH", url: "https://anonymiketech.com" }],
  creator: "ANONYMIKETECH",
  publisher: "ANONYMIKETECH",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://anonymiketech.com",
    siteName: "ANONYMIKETECH",
    title: "ANONYMIKETECH | Web Development, AI Chatbots & Internet Services",
    description: "Professional tech solutions including web development, AI chatbots, internet services, and premium app marketplace in Kenya.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ANONYMIKETECH - Professional Tech Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ANONYMIKETECH | Web Development & Tech Solutions",
    description: "Professional tech services in Kenya - web development, AI chatbots, internet services, and more.",
    creator: "@anonymiketech",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://anonymiketech.com",
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
        <link rel="canonical" href="https://anonymiketech.com" />
        <meta name="google-site-verification" content="RXEq3eYoTzFZAXaL9QlMkQ8NvfemjL4wHW5g5JXesHk" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ANONYMIKETECH",
              url: "https://anonymiketech.com",
              logo: "https://anonymiketech.com/logo.png",
              description: "Professional web development, AI chatbots, and internet services in Kenya",
              sameAs: [
                "https://www.instagram.com/anonymiketech",
                "https://www.facebook.com/anonymiketech",
                "https://www.twitter.com/anonymiketech"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+254113313240",
                email: "anonymiketech@gmail.com",
                areaServed: "KE",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "KE",
                addressLocality: "Nairobi",
              },
            }),
          }}
        />

        {/* Structured Data - Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ANONYMIKETECH",
              url: "https://anonymiketech.com",
              description: "Professional tech solutions and services",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://anonymiketech.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

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
