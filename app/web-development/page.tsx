"use client"

import { useState } from "react"
import {
  Code,
  Palette,
  Smartphone,
  Rocket,
  Database,
  Shield,
  Globe,
  Building2,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { motion } from "framer-motion"
import MatrixRain from "@/components/MatrixRain"
import ServiceHero from "@/components/ServiceHero"
import ContactButtons from "@/components/ContactButtons"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import WebsiteTypeModal from "@/components/WebsiteTypeModal"
import { getCurrentYear } from "@/utils/getCurrentYear"
import ChatbaseEmbed from "@/components/ChatbaseEmbed"

export default function WebDevelopment() {
  const [selectedType, setSelectedType] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const websiteTypes = [
    {
      title: "Business Web Design",
      icon: <Building2 className="w-12 h-12" />,
      description: "Professional business websites tailored to your company's needs",
      features: ["Company Profile", "Services Showcase", "Team Directory", "Lead Generation Forms", "Blog Integration"],
      color: "from-blue-500 to-cyan-500",
      use_cases: ["Corporations", "Consultancies", "Service Providers", "B2B Companies"],
      price: 18000, // KSH
    },
    {
      title: "Personal/Blog Web Design",
      icon: <Globe className="w-12 h-12" />,
      description: "Personal portfolios and content-driven websites",
      features: ["CMS Integration", "Comment System", "Category Tags", "Author Profiles", "Search Functionality"],
      color: "from-indigo-500 to-blue-500",
      use_cases: ["News Sites", "Blogs", "Magazines", "Educational Portals"],
      price: 15000, // KSH
    },
    {
      title: "Ecommerce Web Design",
      icon: <ShoppingCart className="w-12 h-12" />,
      description: "Full-featured online stores for retail businesses",
      features: ["Product Catalog", "Shopping Cart", "Payment Gateway", "Inventory Management", "Order Tracking"],
      color: "from-green-500 to-emerald-500",
      use_cases: ["Online Stores", "Retail Shops", "Digital Products", "Subscription Services"],
      price: 30000, // KSH
    },
    {
      title: "NGO Website Design",
      icon: <Heart className="w-12 h-12" />,
      description: "Mission-driven websites for non-profit organizations",
      features: ["Donation System", "Volunteer Portal", "Impact Stories", "Event Management", "Newsletter Integration"],
      color: "from-red-500 to-pink-500",
      use_cases: ["Charities", "Foundations", "Community Organizations", "Religious Groups"],
      price: 17000, // KSH
    },
    {
      title: "Real Estate Web App",
      icon: <Building2 className="w-12 h-12" />,
      description: "Advanced real estate platforms with property listings",
      features: ["Property Search", "Virtual Tours", "Agent Profiles", "Advanced Filters", "Lead Management"],
      color: "from-orange-500 to-red-500",
      use_cases: ["Real Estate Agencies", "Property Developers", "Real Estate Marketers"],
      price: 20000, // KSH
    },
    {
      title: "Travel Booking Website",
      icon: <Globe className="w-12 h-12" />,
      description: "Complete travel and booking platforms",
      features: ["Booking System", "Payment Integration", "Itinerary Management", "Review System", "Map Integration"],
      color: "from-purple-500 to-pink-500",
      use_cases: ["Travel Agencies", "Tour Operators", "Hospitality Services"],
      price: 30000, // KSH
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

  const openModal = (type: any) => {
    setSelectedType(type)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <ChatbaseEmbed />
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        <ServiceHero
          title="WEB DEVELOPMENT"
          subtitle="// Modern Web Solutions"
          description="Create stunning, high-performance websites and applications that drive results. From simple landing pages to complex enterprise solutions, we build the digital presence your business deserves."
          icon={<Code />}
          backgroundPattern="</>"
        />

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

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // WEBSITE TYPES & SOLUTIONS
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websiteTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  {/* Background glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300`}
                  ></div>

                  <div className="relative glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm h-full flex flex-col">
                    {/* Icon and header */}
                    <div className="mb-6">
                      <div
                        className={`inline-block p-3 rounded-lg bg-gradient-to-r ${type.color} text-white mb-4 group-hover:animate-pulse`}
                      >
                        {type.icon}
                      </div>
                      <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-2 glow-text">
                        {type.title}
                      </h3>
                      <p className="text-hacker-green-dim text-sm">{type.description}</p>
                      <p className="text-hacker-green-bright font-tech font-bold mt-3">
                        From KSH {type.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 flex-grow">
                      <h4 className="text-hacker-green-bright font-tech font-bold mb-3 text-sm uppercase">
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {type.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-hacker-green-dim text-sm">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${type.color}`}
                            ></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use cases */}
                    <div className="mb-6">
                      <h4 className="text-hacker-green-bright font-tech font-bold mb-3 text-sm uppercase">
                        Perfect For:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {type.use_cases.map((useCase, caseIndex) => (
                          <span
                            key={caseIndex}
                            className="px-3 py-1 text-xs font-tech bg-hacker-green/10 text-hacker-green-bright rounded border border-hacker-green-dim/50 group-hover:border-hacker-green-bright transition-colors"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(type)}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold hover:shadow-lg hover:shadow-hacker-green/50 transition-all"
                    >
                      ORDER NOW
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* NGO Website - Economic Justice Forum */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg glow-border h-[400px]"
              >
                <img
                  src="/images/image.png"
                  alt="Economic Justice Forum Website"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/75"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="inline-block px-3 py-1 text-xs font-tech bg-red-500/80 text-white rounded mb-3 backdrop-blur-sm">
                      NON-GOVERNMENTAL
                    </span>
                    <h3 className="text-3xl font-tech font-bold text-white mb-3 glow-text group-hover:animate-flicker">
                      Economic Justice Forum
                    </h3>
                    <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                      Mission-driven platform for economic, climate, social & digital justice advocacy with donation
                      systems and community engagement features.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Next.js", "Tailwind CSS", "Donation Portal", "CMS"].map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-tech bg-white/10 text-white rounded border border-white/30 backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://www.economicjusticeforum.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-hacker-green-bright font-tech text-sm hover:gap-3 transition-all duration-300"
                    >
                      <Globe className="w-4 h-4" />
                      www.economicjusticeforum.org
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Tours & Travels Website - Mzedu Tours */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg glow-border h-[400px]"
              >
                {/* Background Image */}
                <img
                  src="/images/mzedu-tours.jpg"
                  alt="Mzedu Tours and Travels Website"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/75"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="inline-block px-3 py-1 text-xs font-tech bg-orange-500/80 text-white rounded mb-3 backdrop-blur-sm">
                      TOURS & TRAVELS
                    </span>
                    <h3 className="text-3xl font-tech font-bold text-white mb-3 glow-text group-hover:animate-flicker">
                      Mzedu Tours and Travels
                    </h3>
                    <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                      Full-featured safari and travel booking platform with itinerary management, gallery showcase, and
                      seamless booking experience for Kenya's magnificent wilderness.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["React", "Booking System", "Gallery", "Responsive Design"].map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-tech bg-white/10 text-white rounded border border-white/30 backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://www.mzedutoursandtravels.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-hacker-green-bright font-tech text-sm hover:gap-3 transition-all duration-300"
                    >
                      <Globe className="w-4 h-4" />
                      www.mzedutoursandtravels.com
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {/* E-commerce Website - Zyra Africa */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg glow-border h-[400px]"
              >
                {/* Background Image */}
                <img
                  src="/images/zyra-africa.jpg"
                  alt="Zyra Africa - Ethical Gemstones Website"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/75"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="inline-block px-3 py-1 text-xs font-tech bg-cyan-500/80 text-white rounded mb-3 backdrop-blur-sm">
                      E-COMMERCE
                    </span>
                    <h3 className="text-3xl font-tech font-bold text-white mb-3 glow-text group-hover:animate-flicker">
                      Zyra Africa
                    </h3>
                    <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                      Premium e-commerce platform for ethically sourced, uncut and faceted gemstones from Taita Taveta County, Kenya. Features seamless shopping, buyer services, and direct miner connections.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Next.js", "E-commerce", "Product Gallery", "Payment Integration"].map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-tech bg-white/10 text-white rounded border border-white/30 backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://www.zyragems.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-hacker-green-bright font-tech text-sm hover:gap-3 transition-all duration-300"
                    >
                      <Globe className="w-4 h-4" />
                      www.zyragems.com
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Coming Soon - Future Projects */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg glow-border h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-dashed border-hacker-green-bright/30"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-hacker-green-bright/20 via-transparent to-cyan-500/20 animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="mb-6"
                  >
                    <div className="text-6xl mb-4">🔮</div>
                  </motion.div>

                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-tech font-bold text-hacker-green-bright mb-3 glow-text"
                  >
                    More Showcases
                  </motion.h3>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-300 mb-6 leading-relaxed text-sm max-w-xs"
                  >
                    Exciting new projects and innovative digital solutions coming very soon. Stay tuned for more extraordinary work.
                  </motion.p>

                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="inline-block px-6 py-2 border-2 border-hacker-green-bright rounded-lg"
                  >
                    <span className="font-tech text-hacker-green-bright font-bold animate-pulse">COMING SOON</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

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

      <WebsiteTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={selectedType} />
    </div>
  )
}
