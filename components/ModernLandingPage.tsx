"use client"

import AnimatedHero from "./AnimatedHero"
import TestimonialQuote from "./TestimonialQuote"
import GettingStartedSection from "./GettingStartedSection"
import TeamTestimonials from "./TeamTestimonials"
import TrustedCompanies from "./TrustedCompanies"
import MultiPlatformSection from "./MultiPlatformSection"
import ResourceCards from "./ResourceCards"
import CTASection from "./CTASection"
import TechStackSection from "./TechStackSection"
import PortfolioShowcase from "./PortfolioShowcase"

export default function ModernLandingPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-foreground overflow-hidden">
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Testimonial Quote Section */}
      <TestimonialQuote />

      {/* Getting Started Section */}
      <GettingStartedSection />

      {/* Team Testimonials */}
      <TeamTestimonials />

      {/* Trusted Companies */}
      <TrustedCompanies />

      {/* Multi-Platform Section */}
      <MultiPlatformSection />

      {/* Resource Cards */}
      <ResourceCards />

      {/* Main CTA Section */}
      <CTASection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Portfolio Showcase */}
      <PortfolioShowcase />

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg text-white mb-4">ANONYMIKETECH</h4>
            <p className="text-sm text-gray-400">Innovation at the speed of thought</p>
          </div>
          {[
            { 
              title: "Services", 
              items: [
                { name: "Web Development", href: "/web-development" },
                { name: "AI Chatbots", href: "/chatbots-ai" },
                { name: "Internet Services", href: "/internet-services" },
                { name: "Social Media", href: "/social-media-boosting" }
              ] 
            },
            { 
              title: "Company", 
              items: [
                { name: "About", href: "/portfolio" },
                { name: "Contact", href: "/contact" },
                { name: "Premium Apps", href: "/premium-apps" },
                { name: "Careers", href: "/contact" }
              ] 
            },
            { 
              title: "Resources", 
              items: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Cookie Policy", href: "/cookie-policy" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Contact Us", href: "/contact" }
              ] 
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-lg text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 ANONYMIKETECH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
