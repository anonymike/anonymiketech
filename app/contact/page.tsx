'use client'

import React from "react"
import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle } from 'lucide-react'
import BackToTop from '@/components/BackToTop'
import ContactButtons from '@/components/ContactButtons'
import ChatbaseEmbed from '@/components/ChatbaseEmbed'

function ContactForm() {
  const [state, handleSubmit] = useForm("mykdbpzy")

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <label htmlFor="name" className="block text-hacker-green font-tech font-semibold mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-hacker-green/30 text-white placeholder-hacker-green-dim font-tech focus:outline-none focus:border-hacker-green focus:ring-2 focus:ring-hacker-green/30 transition-all"
        />
        <ValidationError 
          prefix="Name" 
          field="name"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <label htmlFor="email" className="block text-hacker-green font-tech font-semibold mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-hacker-green/30 text-white placeholder-hacker-green-dim font-tech focus:outline-none focus:border-hacker-green focus:ring-2 focus:ring-hacker-green/30 transition-all"
        />
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </motion.div>

      {/* Phone Field */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <label htmlFor="phone" className="block text-hacker-green font-tech font-semibold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+1 (555) 000-0000"
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-hacker-green/30 text-white placeholder-hacker-green-dim font-tech focus:outline-none focus:border-hacker-green focus:ring-2 focus:ring-hacker-green/30 transition-all"
        />
        <ValidationError 
          prefix="Phone" 
          field="phone"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </motion.div>

      {/* Subject Field */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        viewport={{ once: true }}
      >
        <label htmlFor="subject" className="block text-hacker-green font-tech font-semibold mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          placeholder="Project inquiry, consultation, etc."
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-hacker-green/30 text-white placeholder-hacker-green-dim font-tech focus:outline-none focus:border-hacker-green focus:ring-2 focus:ring-hacker-green/30 transition-all"
        />
        <ValidationError 
          prefix="Subject" 
          field="subject"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </motion.div>

      {/* Message Field */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <label htmlFor="message" className="block text-hacker-green font-tech font-semibold mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Tell us about your project or inquiry..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-hacker-green/30 text-white placeholder-hacker-green-dim font-tech focus:outline-none focus:border-hacker-green focus:ring-2 focus:ring-hacker-green/30 transition-all resize-none"
        />
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        viewport={{ once: true }}
        className="pt-4"
      >
        <motion.button
          type="submit"
          disabled={state.submitting}
          whileHover={!state.submitting ? { scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)' } : {}}
          whileTap={!state.submitting ? { scale: 0.95 } : {}}
          className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold text-lg hover:shadow-lg hover:shadow-hacker-green/50 transition-all border-2 border-transparent hover:border-hacker-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            {state.submitting ? 'Sending...' : 'Send Message'}
          </span>
        </motion.button>
      </motion.div>

      {/* Success Message */}
      {state.succeeded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-green-500/20 border-2 border-green-500/50 p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-300 font-tech font-semibold">Message sent successfully!</p>
            <p className="text-green-200 text-sm">We&apos;ll get back to you as soon as possible.</p>
          </div>
        </motion.div>
      )}

      {/* Form Note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center text-hacker-green-dim text-sm font-tech"
      >
        We&apos;ll get back to you as soon as possible. Typically within 24 hours.
      </motion.p>
    </form>
  )
}

export default function ContactPage() {
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
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const phoneNumbers = [
    { number: '+254113313240', label: 'Phone 1' },
    { number: '+254782829321', label: 'Phone 2' },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'anonymiketech@gmail.com',
      link: 'mailto:anonymiketech@gmail.com',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: 'Call Us Now',
      link: `tel:${phoneNumbers[0].number}`,
      color: 'from-blue-500 to-cyan-500',
      phones: phoneNumbers,
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Nairobi, Kenya',
      link: 'https://maps.google.com/?q=Nairobi,Kenya',
      color: 'from-emerald-500 to-green-500',
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/anonymike',
      color: 'hover:text-gray-400',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/michaelmshila',
      color: 'hover:text-blue-400',
    },
    {
      icon: Mail,
      label: 'Email',
      url: 'mailto:anonymiketech@gmail.com',
      color: 'hover:text-red-400',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-hacker-terminal via-slate-950 to-hacker-terminal pt-32 pb-20">
      <ChatbaseEmbed />
      <BackToTop />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-20"
      >
        <motion.div
          animate={{
            textShadow: [
              '0 0 5px #00ff00',
              '0 0 20px #00ff00',
              '0 0 5px #00ff00',
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-tech font-bold text-hacker-green mb-4">
            // CONNECT WITH US
          </h1>
          <p className="text-xl text-hacker-green-dim font-tech">
            Let&apos;s build something amazing together
          </p>
        </motion.div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, idx) => {
            const IconComponent = info.icon
            return (
              <motion.div key={idx} variants={itemVariants}>
                <motion.a
                  href={info.link}
                  target={info.link?.includes('maps.google.com') ? '_blank' : undefined}
                  rel={info.link?.includes('maps.google.com') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -8 }}
                  className="group block h-full"
                >
                  <div className="relative h-full rounded-2xl border-2 border-hacker-green/30 bg-gradient-to-br from-hacker-green/10 to-emerald-500/5 p-8 overflow-hidden hover:border-hacker-green transition-all duration-300">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-10`}
                      />
                    </div>

                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="mb-4 inline-block p-4 rounded-lg bg-hacker-green/10 border border-hacker-green/30"
                      >
                        <IconComponent className="w-8 h-8 text-hacker-green" />
                      </motion.div>

                      <h3 className="text-2xl font-tech font-bold text-hacker-green mb-2">
                        {info.title}
                      </h3>
                      <p className="text-hacker-green-dim text-lg font-semibold">
                        {info.value}
                      </p>
                      {info.phones && (
                        <div className="mt-4 pt-4 border-t border-hacker-green/20 space-y-2">
                          {info.phones.map((phone, phoneIdx) => (
                            <button
                              key={phoneIdx}
                              onClick={() => (window.location.href = `tel:${phone.number}`)}
                              className="block w-full text-left text-hacker-green-bright hover:text-hacker-green transition-colors font-tech text-sm hover:pl-1 transition-all"
                            >
                              {phone.number}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.a>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 text-hacker-green"
        >
          Send Us a Message
        </motion.h2>

        <div className="max-w-2xl mx-auto rounded-2xl border-2 border-hacker-green/40 bg-gradient-to-br from-hacker-terminal via-slate-950 to-hacker-terminal/80 p-12 backdrop-blur-sm overflow-hidden">
          <ContactForm />
        </div>
      </motion.section>

      {/* Main Contact Section with ContactButtons */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="rounded-2xl border-2 border-hacker-green/40 bg-gradient-to-br from-hacker-terminal via-slate-950 to-hacker-terminal/80 p-12 backdrop-blur-sm overflow-hidden relative">
          {/* Animated background lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-hacker-green rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative">
            <motion.h2
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 text-hacker-green"
              animate={{
                textShadow: [
                  '0 0 5px #00ff00',
                  '0 0 20px #00ff00',
                  '0 0 5px #00ff00',
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Get In Touch With Our Team
            </motion.h2>

            {/* Contact Buttons Component */}
            <div className="flex justify-center mb-12">
              <ContactButtons />
            </div>

            {/* Social Links */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center gap-8 flex-wrap"
            >
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group p-4 rounded-xl border-2 border-hacker-green/30 bg-hacker-green/5 hover:border-hacker-green transition-all ${social.color}`}
                  >
                    <IconComponent className="w-6 h-6 text-hacker-green group-hover:text-hacker-green-bright transition-colors" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <motion.h2
          className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 text-hacker-green"
          animate={{
            textShadow: [
              '0 0 5px #00ff00',
              '0 0 20px #00ff00',
              '0 0 5px #00ff00',
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Find Us in Nairobi
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 border-hacker-green/40 overflow-hidden shadow-2xl shadow-hacker-green/20 h-96"
        >
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8255161803634!2d36.81622!3d-1.28645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d84d49a5%3A0xf04b7c7e5d4c3c3c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1234567890123"
            style={{
              border: '2px solid rgba(0, 255, 0, 0.4)',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://maps.google.com/?q=Nairobi,Kenya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-hacker-green text-hacker-terminal font-tech font-bold hover:bg-hacker-green-bright transition-all"
          >
            <MapPin className="w-5 h-5" />
            Get Directions to Nairobi
          </a>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 text-hacker-green"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              q: 'What services do you offer?',
              a: 'We provide comprehensive digital solutions including web development, AI chatbots, social media management, and cybersecurity consulting.',
            },
            {
              q: 'How long does a typical project take?',
              a: 'Project timelines vary based on scope and complexity. We provide detailed estimates after understanding your requirements.',
            },
            {
              q: 'Do you offer support after deployment?',
              a: 'Yes, we provide ongoing support and maintenance packages to ensure your solutions continue to perform optimally.',
            },
            {
              q: 'What is your pricing model?',
              a: 'Our pricing is flexible and tailored to your project needs. We offer hourly rates, project-based pricing, and retainer options.',
            },
          ].map((faq, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className="rounded-xl border-2 border-hacker-green/30 bg-gradient-to-br from-hacker-green/10 to-emerald-500/5 p-6 hover:border-hacker-green transition-all">
                <h3 className="text-lg font-tech font-bold text-hacker-green mb-3">
                  {faq.q}
                </h3>
                <p className="text-hacker-green-dim leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  )
}
