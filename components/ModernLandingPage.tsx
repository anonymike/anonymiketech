"use client"

import { motion } from "framer-motion"
import { ArrowRight, Code, Bot, TrendingUp, Shield, Wifi, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedHero from "./AnimatedHero"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const floatVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
}

export default function ModernLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-bg via-tech-bg-dark to-tech-bg text-foreground overflow-hidden">
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Services Section */}
      <motion.section
        className="relative z-10 container mx-auto px-4 py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-accent">Services & Solutions</span>
          </div>
        </motion.div>

        {/* Services Title */}
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold text-center mb-12 text-balance leading-tight"
        >
          What We{" "}
          <span className="bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
            Offer
          </span>
        </motion.h2>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-lg font-semibold group"
          >
            Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:border-primary rounded-full px-8 py-6 text-lg font-semibold"
          >
            View Our Services
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-bold text-accent">500+</div>
            <div className="text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime SLA</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
            <div className="text-sm text-muted-foreground">Expert Support</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Services Grid */}
      <motion.section className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive digital solutions designed to empower your business
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Code,
              title: "Web Development",
              description: "Modern, responsive websites with React & Next.js",
              accent: "from-blue-500",
            },
            {
              icon: Bot,
              title: "AI Chatbots",
              description: "Intelligent automation for customer engagement",
              accent: "from-purple-500",
            },
            {
              icon: Shield,
              title: "Internet Services",
              description: "Secure VPN and anonymous browsing solutions",
              accent: "from-red-500",
            },
            {
              icon: TrendingUp,
              title: "Social Media",
              description: "Professional post design and growth strategy",
              accent: "from-pink-500",
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl border border-primary/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:border-accent/50"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative z-10">
                <service.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Feature Showcase */}
      <motion.section className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
            <ul className="space-y-4">
              {[
                "Expert team of certified developers and designers",
                "Cutting-edge technology stack and best practices",
                "Fast deployment and 24/7 technical support",
                "Transparent pricing and flexible payment options",
                "Proven track record with 500+ successful projects",
                "Custom solutions tailored to your needs",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={floatVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Wifi, label: "Secure", color: "text-blue-400" },
              { icon: Globe, label: "Global", color: "text-purple-400" },
              { icon: MessageSquare, label: "24/7 Chat", color: "text-pink-400" },
              { icon: Zap, label: "Lightning Fast", color: "text-yellow-400" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl border border-primary/20 bg-white/5 backdrop-blur-xl hover:border-accent/50 text-center transition-all"
              >
                <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative z-10 container mx-auto px-4 py-24"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="rounded-3xl border border-accent/20 bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 backdrop-blur-xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of successful businesses using our solutions
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 py-6 text-lg font-semibold group"
          >
            Get Started Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">ANONYMIKETECH</h4>
            <p className="text-sm text-muted-foreground">Innovation at the speed of thought</p>
          </div>
          {[
            { title: "Services", items: ["Web Dev", "AI Chatbots", "Internet", "Social Media"] },
            { title: "Company", items: ["About", "Contact", "Blog", "Careers"] },
            { title: "Resources", items: ["Documentation", "Support", "Pricing", "FAQ"] },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 ANONYMIKETECH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
