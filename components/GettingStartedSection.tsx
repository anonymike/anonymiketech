"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const portfolioItems = [
  { id: 1, title: "Web Development", emoji: "🌐" },
  { id: 2, title: "UI/UX Design", emoji: "🎨" },
  { id: 3, title: "Brand Strategy", emoji: "🎯" },
  { id: 4, title: "Mobile Apps", emoji: "📱" },
  { id: 5, title: "3D Experience", emoji: "🎭" },
  { id: 6, title: "Animation", emoji: "✨" },
]

export default function GettingStartedSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length)
  }

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
            Getting started with AnonyMikeTech
          </h2>
          <p className="text-gray-400 text-lg">
            Explore our services and learn with written docs and video tutorials.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Community Platform
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Explore and remix designs made by our community members. Access our growing library of resources and examples to accelerate your projects.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 group w-fit"
            >
              Explore Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Side - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Main carousel */}
            <div className="grid grid-cols-3 gap-4">
              {portfolioItems.map((item, index) => {
                const distance = (index - currentIndex + portfolioItems.length) % portfolioItems.length
                const isVisible = distance < 3
                
                return (
                  <motion.div
                    key={item.id}
                    animate={{ 
                      opacity: isVisible ? 1 : 0.3,
                      scale: distance === 0 ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      distance === 0
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-900/20 to-blue-900/20"
                        : "border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <p className={`text-sm font-semibold ${distance === 0 ? "text-white" : "text-gray-400"}`}>
                      {item.title}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 text-white hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                ←
              </motion.button>
              <div className="flex gap-2">
                {portfolioItems.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentIndex ? 24 : 8,
                      backgroundColor: i === currentIndex ? "rgb(0, 217, 255)" : "rgb(107, 114, 128)",
                    }}
                    className="h-2 rounded-full transition-all"
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 text-white hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
