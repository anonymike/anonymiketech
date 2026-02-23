import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio | AnonyMikeTech - Full Stack Developer & Tech Innovator",
  description:
    "Explore my professional portfolio showcasing web development, AI integration, chatbots, and digital innovation projects. Full-stack developer specializing in modern tech solutions.",
  keywords: [
    "portfolio",
    "full stack developer",
    "web development",
    "AI chatbots",
    "React",
    "Next.js",
    "tech innovation",
    "digital solutions",
  ],
  openGraph: {
    title: "Portfolio | AnonyMikeTech",
    description: "Professional portfolio of a full-stack developer specializing in modern web and AI solutions",
    type: "website",
    url: "https://anonymiketech.com/portfolio",
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
