"use client"

import { motion } from "framer-motion"

const companies = [
  { name: "Google", logo: "G" },
  { name: "Microsoft", logo: "MS" },
  { name: "Meta", logo: "f" },
  { name: "Apple", logo: "A" },
  { name: "Amazon", logo: "A" },
  { name: "Netflix", logo: "N" },
  { name: "Tesla", logo: "T" },
  { name: "Spotify", logo: "S" },
]

export default function TrustedCompanies() {
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
          <p className="text-gray-400 text-lg md:text-xl mb-4">
            Empowering individuals and teams at{" "}
            <span className="text-white font-semibold">world's leading organizations</span>
          </p>
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl hover:from-cyan-900 hover:to-blue-900 transition-all duration-300 cursor-pointer"
            >
              {company.logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
