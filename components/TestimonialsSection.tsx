'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company: string
  message: string
  rating: number
  icon: string
  height: 'short' | 'tall'
  column: 0 | 1
}

const testimonials: Testimonial[] = [
  {
    name: 'James Kipchoge',
    role: 'Tech Director',
    company: 'Nairobi Tech Solutions',
    message: 'AnonyMikeTech transformed our digital presence completely. The web development and chatbot integration was seamless and professional.',
    rating: 5,
    icon: '🚀',
    height: 'tall',
    column: 0,
  },
  {
    name: 'Amara Okonkwo',
    role: 'Marketing Manager',
    company: 'Mombasa Digital Agency',
    message: 'The social media boosting service increased our engagement by 300%. Highly recommended.',
    rating: 5,
    icon: '📱',
    height: 'short',
    column: 1,
  },
  {
    name: 'David Kariuki',
    role: 'Business Owner',
    company: 'Kisumu Enterprise Hub',
    message: 'Exceptional customer service and technical expertise. The VPN and internet solutions keep our operations running smoothly 24/7.',
    rating: 5,
    icon: '🔒',
    height: 'short',
    column: 0,
  },
  {
    name: 'Grace Njoroge',
    role: 'CEO',
    company: 'Nakuru Innovation Labs',
    message: 'The AI chatbot implementation saved us thousands in customer support costs. Professional, efficient, and innovative!',
    rating: 5,
    icon: '🤖',
    height: 'tall',
    column: 1,
  },
  {
    name: 'Peter Mwangi',
    role: 'Project Manager',
    company: 'Eldoret Web Studios',
    message: 'Working with Michael was a game-changer. The technical knowledge and attention to detail is outstanding.',
    rating: 5,
    icon: '⭐',
    height: 'short',
    column: 0,
  },
  {
    name: 'Zainab Hassan',
    role: 'Business Strategist',
    company: 'Mombasa Growth Collective',
    message: 'AnonyMikeTech consistently delivers excellence. Their innovative approach is unmatched in the industry.',
    rating: 5,
    icon: '💡',
    height: 'tall',
    column: 1,
  },
]

export default function TestimonialsSection() {
  const columnTestimonials = [
    testimonials.filter((t) => t.column === 0),
    testimonials.filter((t) => t.column === 1),
  ]

  const slideVariants = (isLeftColumn: boolean) => ({
    hidden: {
      opacity: 0,
      x: isLeftColumn ? -80 : 80,
      y: 40,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-tech font-bold mb-4">
            <span className="text-hacker-green">// WHAT OUR CLIENTS SAY</span>
          </h2>
          <p className="text-gray-400 text-lg font-tech max-w-2xl mx-auto">
            Real feedback from businesses across Kenya who trust AnonyMikeTech for their digital transformation
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {columnTestimonials.map((column, columnIdx) => (
            <div key={columnIdx} className="flex flex-col gap-6 md:gap-8">
              {column.map((testimonial, idx) => (
                <motion.div
                  key={`${columnIdx}-${idx}`}
                  custom={idx}
                  variants={slideVariants(columnIdx === 0)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className={`group relative ${
                    testimonial.height === 'tall' ? 'md:row-span-2 md:h-96' : 'h-auto'
                  }`}
                >
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-emerald-900/20 border-2 border-emerald-400/30 hover:border-emerald-400/70 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-emerald-400/20">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/50 via-cyan-400/50 to-blue-400/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Icon and header */}
                    <div className="mb-6">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {testimonial.icon}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {testimonial.name}
                      </h3>
                      <p className="text-emerald-400 font-tech text-sm mb-1">{testimonial.role}</p>
                      <p className="text-gray-500 font-tech text-xs">{testimonial.company}</p>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Message */}
                    <p className="text-gray-300 leading-relaxed flex-grow text-sm md:text-base">
                      <span className="text-emerald-400 font-tech">"</span>
                      {testimonial.message}
                      <span className="text-emerald-400 font-tech">"</span>
                    </p>

                    {/* Bottom accent */}
                    <div className="mt-6 pt-4 border-t border-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 pt-8 border-t border-emerald-400/20"
        >
          <p className="text-gray-400 font-tech mb-4">Ready to become our next success story?</p>
          <a
            href="mailto:anonymiketech@gmail.com"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold hover:shadow-2xl hover:shadow-emerald-400/50 transition-all hover:scale-105"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}
