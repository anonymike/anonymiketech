"use client"

import { motion } from "framer-motion"

export default function TestimonialQuote() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          {/* Company Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              AM
            </div>
          </div>

          {/* Testimonial Quote */}
          <blockquote className="space-y-4">
            <p className="text-2xl md:text-4xl font-bold text-white leading-tight">
              "We believe in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                cutting-edge innovation
              </span>
              . That's where AnonyMikeTech comes in. It helps our brand feel more advanced than our competition."
            </p>
          </blockquote>

          {/* Speaker Info */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              MM
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-lg">Michael Mshila</p>
              <p className="text-gray-400">Owner & Full Stack Developer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
