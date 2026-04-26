"use client"

import { motion } from "framer-motion"

const tools = [
  { name: "Webflow", logo: "WF" },
  { name: "Framer", logo: "F" },
  { name: "Wix Studio", logo: "WS" },
  { name: "HTML/JS", logo: "JS" },
  { name: "React", logo: "R" },
  { name: "Next.js", logo: "N" },
  { name: "Swift", logo: "S" },
  { name: "Kotlin", logo: "K" },
]

const stackTestimonials = [
  {
    logo: "WF",
    company: "Webflow Studio",
    quote: "Building interactive experiences with this platform has changed how we approach design.",
    name: "Alex Johnson",
    title: "Design Director",
  },
  {
    logo: "RT",
    company: "React Team",
    quote: "The seamless integration with modern frameworks makes development incredibly efficient.",
    name: "Sarah Chen",
    title: "Lead Developer",
  },
  {
    logo: "NK",
    company: "Next.js Collective",
    quote: "Perfect for teams that want to build fast, scalable applications with beautiful UIs.",
    name: "David Kipchoge",
    title: "Tech Lead",
  },
]

export default function TechStackSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-32"
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl hover:from-cyan-900 hover:to-blue-900 transition-all duration-300 cursor-pointer"
              >
                {tool.logo}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-16 md:my-24" />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by innovative teams
          </h2>
          <p className="text-xl text-gray-400">around the world</p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {stackTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-gray-900/50 to-gray-950/50 hover:border-cyan-500/50 transition-colors duration-300"
            >
              {/* Logo */}
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6">
                {testimonial.logo}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div>
                <p className="font-semibold text-white text-lg">
                  {testimonial.name}
                </p>
                <p className="text-gray-400 text-sm">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
