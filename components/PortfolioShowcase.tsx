"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const portfolioProjects = [
  {
    id: 1,
    title: "Interactive Design System",
    category: "Web Design",
    creator: "Michael Mshila",
    image: "🎨",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    category: "Full Stack",
    creator: "Michael Mshila",
    image: "🛍️",
  },
  {
    id: 3,
    title: "Mobile App UI",
    category: "App Design",
    creator: "Michael Mshila",
    image: "📱",
  },
  {
    id: 4,
    title: "Real-time Chat Application",
    category: "Web App",
    creator: "Michael Mshila",
    image: "💬",
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    category: "Data Visualization",
    creator: "Michael Mshila",
    image: "📊",
  },
  {
    id: 6,
    title: "Brand Identity Suite",
    category: "Branding",
    creator: "Michael Mshila",
    image: "🎭",
  },
]

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
    transition: { duration: 0.6 },
  },
}

export default function PortfolioShowcase() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-950 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            A complete platform for real-time interactive design
          </h2>
          <p className="text-gray-400 text-lg">
            Explore the portfolio and see what&apos;s possible
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group border border-gray-800 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-950/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
            >
              {/* Project Image */}
              <div className="w-full h-48 md:h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl overflow-hidden">
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {project.image}
                </span>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-cyan-400 font-semibold mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-400">{project.creator}</p>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                >
                  View Project
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 group"
          >
            View Full Portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
