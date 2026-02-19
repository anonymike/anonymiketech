"use client"

import { Code, Palette, Smartphone, Rocket, Database, Shield } from "lucide-react"
import { motion } from "framer-motion"
import MatrixRain from "../components/MatrixRain"
import ServiceHero from "../components/ServiceHero"
import PricingCard from "../components/PricingCard"
import ContactButtons from "../components/ContactButtons"
import MobileMenu from "../components/MobileMenu"
import BackToTop from "../components/BackToTop"

function getCurrentYear() {
  return new Date().getFullYear()
}

export default function WebDevelopment() {
  const technologies = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Modern Frameworks",
      description: "React, Next.js, Vue.js, and cutting-edge technologies.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Custom Design",
      description: "Unique, responsive designs tailored to your brand.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First",
      description: "Optimized for all devices and screen sizes.",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with sub-second load times.",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Integration",
      description: "Full-stack solutions with modern databases.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security First",
      description: "Built with security best practices from the ground up.",
    },
  ]

  const portfolioItems = [
    {
      title: "E-Commerce Platform",
      description: "Full-featured online store with payment integration",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "Corporate Website",
      description: "Professional business website with CMS",
      tech: ["Next.js", "TypeScript", "Tailwind", "Sanity"],
    },
    {
      title: "SaaS Dashboard",
      description: "Complex data visualization and user management",
      tech: ["Vue.js", "D3.js", "PostgreSQL", "AWS"],
    },
    {
      title: "Mobile App",
      description: "Cross-platform mobile application",
      tech: ["React Native", "Firebase", "Redux", "GraphQL"],
    },
  ]

  const webPlans = [
    {
      title: "Landing Page",
      price: "KSH 15,000",
      period: "project",
      features: [
        "Single Page Design",
        "Responsive Layout",
        "Contact Form",
        "SEO Optimization",
        "1 Month Support",
        "Domain Setup",
      ],
    },
    {
      title: "Business Website",
      price: "KSH 22,000",
      period: "project",
      popular: true,
      features: [
        "Up to 10 Pages",
        "Custom Design",
        "CMS Integration",
        "E-commerce Ready",
        "SEO & Analytics",
        "3 Months Support",
        "Performance Optimization",
        "Mobile App Version",
      ],
    },
    {
      title: "Enterprise Solution",
      price: "KSH 50,000",
      period: "project",
      features: [
        "Unlimited Pages",
        "Custom Functionality",
        "Advanced Integrations",
        "User Management",
        "Database Design",
        "6 Months Support",
        "Hosting Setup",
        "Staff Training",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        <ServiceHero
          title="WEB DEVELOPMENT"
          subtitle="// Modern Web Solutions"
          description="Create stunning, high-performance websites and applications that drive results. From simple landing pages to complex enterprise solutions, we build the digital presence your business deserves."
          icon={<Code />}
          backgroundPattern="</>{"
        />

        {/* Technologies Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // TECHNOLOGIES & FEATURES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm text-center group hover:animate-glow-pulse"
                >
                  <div className="text-hacker-green mb-4 flex justify-center group-hover:animate-pulse">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-3 glow-text">{tech.title}</h3>
                  <p className="text-hacker-green-dim leading-relaxed">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // PORTFOLIO SHOWCASE
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm group"
                >
                  <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-4 glow-text group-hover:animate-flicker">
                    {item.title}
                  </h3>
                  <p className="text-hacker-green-dim mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map((technology, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-sm font-tech bg-hacker-green/20 text-hacker-green-bright rounded border border-hacker-green-dim"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // DEVELOPMENT PACKAGES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {webPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // DEVELOPMENT PROCESS
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Planning",
                  description: "Requirements analysis and project planning",
                },
                {
                  step: "02",
                  title: "Design",
                  description: "UI/UX design and prototype creation",
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Coding with modern technologies",
                },
                {
                  step: "04",
                  title: "Deployment",
                  description: "Testing, optimization, and launch",
                },
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl font-tech font-bold text-hacker-green/30 mb-4">{process.step}</div>
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-3 glow-text">
                    {process.title}
                  </h3>
                  <p className="text-hacker-green-dim leading-relaxed">{process.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <div className="glow-border rounded-lg p-12 bg-hacker-terminal/30 backdrop-blur-sm text-center">
              <h3 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green-bright mb-6 glow-text">
                Ready to Build Something Amazing?
              </h3>
              <p className="text-xl text-hacker-green-dim mb-8 max-w-2xl mx-auto">
                Let's discuss your project and bring your vision to life with cutting-edge web technologies.
              </p>
              <ContactButtons />
            </div>
          </div>
        </motion.section>

        {/* Copyright Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-8 border-t border-hacker-green/20"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.p
              className="font-tech text-hacker-green-dim hover:text-hacker-green transition-colors duration-300"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              © anonymiketech_inc@{getCurrentYear()}
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
