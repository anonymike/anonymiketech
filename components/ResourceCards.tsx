"use client"

import { motion } from "framer-motion"
import { Package, PlayCircle, FileText, Download, ArrowRight } from "lucide-react"

const resources = [
  {
    icon: Package,
    title: "Library",
    description: "Explore library files.",
    link: "/library",
  },
  {
    icon: PlayCircle,
    title: "Academy",
    description: "Learn with video guides.",
    link: "/academy",
  },
  {
    icon: FileText,
    title: "Docs",
    description: "Learn with written docs.",
    link: "/docs",
  },
  {
    icon: Download,
    title: "Download",
    description: "Download apps and tools.",
    link: "/download",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

export default function ResourceCards() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />

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
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Getting started with AnonyMikeTech
          </h2>
          <p className="text-gray-400 text-lg mt-4">
            Explore resources and learn with written docs and video tutorials.
          </p>
        </motion.div>

        {/* Resource Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.a
                key={index}
                href={resource.link}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-gray-900/50 to-gray-950/50 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {resource.description}
                    </p>
                  </div>

                  <div className="text-cyan-400 group-hover:translate-x-2 transition-transform duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
