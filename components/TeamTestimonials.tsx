"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    logo: "SK",
    company: "TechStart Kenya",
    quote: "AnonyMikeTech transformed our web presence completely. The attention to detail and innovative solutions were exactly what we needed to compete in the market.",
    name: "Samuel Kipchoge",
    title: "Founding Director",
  },
  {
    logo: "GK",
    company: "Design Hub",
    quote: "Working with Michael on our brand redesign was game-changing. The creative approach and technical expertise combined perfectly to deliver something truly remarkable.",
    name: "Grace Kariuki",
    title: "Creative Lead",
  },
  {
    logo: "DO",
    company: "Digital Solutions Ltd",
    quote: "The depth of knowledge in both design and development is rare. Michael delivered a solution that not only met our needs but exceeded all expectations.",
    name: "Daniel Ochieng",
    title: "Chief Technology Officer",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function TeamTestimonials() {
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by innovative teams
          </h2>
          <p className="text-xl text-gray-400">around the world</p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
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
