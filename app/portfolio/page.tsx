'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import BackToTop from '@/components/BackToTop'
import PortfolioLoader from '@/components/PortfolioLoader'
import { Github, Linkedin, Mail, ExternalLink, Globe, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const profile = {
    name: 'MICHAEL MSHILA',
    role: 'Full Stack Developer & Tech Innovator',
    bio: 'Passionate developer specializing in web development, AI integration, and digital transformation. Currently pursuing a Bachelor of Science in Information Technology with a Diploma in ICT (2024). I create innovative digital solutions that drive business growth and technological advancement.',
    image: '/michael-profile.jpg',
  }

  const socials = [
    {
      icon: Globe,
      label: 'Website',
      url: 'https://www.anonymiketech.online',
      color: 'hover:text-emerald-400',
    },
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/anonymike',
      color: 'hover:text-cyan-400',
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

  const skills = [
    { category: 'Frontend Development', items: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend Development', items: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'REST APIs'] },
    { category: 'AI & Automation', items: ['ChatGPT Integration', 'Chatbots', 'AI Automation', 'LLM Integration'] },
    {
      category: 'Services',
      items: ['Web Development', 'Social Media Growth', 'Digital Marketing', 'Internet Services', 'Consulting'],
    },
  ]

  const institutions = [
    {
      name: 'University - Currently Enrolled',
      field: 'Bachelor of Science in Information Technology',
      duration: 'In Progress',
      type: 'Degree',
    },
    {
      name: 'Technical Institute - Graduated 2024',
      field: 'Diploma in Information & Communication Technology (ICT)',
      duration: '2024',
      type: 'Diploma',
    },
    {
      name: 'Self-Directed Learning',
      field: 'Web Development, AI Integration & Cloud Technologies',
      duration: '2020 - Present',
      type: 'Continuous',
    },
  ]

  const certificates = [
    {
      title: 'Cyber Security Fundamentals',
      issuer: 'Certified Credential',
      date: '2024',
      description: 'Comprehensive training in cybersecurity principles, threat detection, and secure system design.',
      skills: ['Threat Analysis', 'Security Protocols', 'Risk Management'],
    },
    {
      title: 'Introduction to CISSP',
      issuer: 'Certified Information Systems Security Professional',
      date: '2024',
      description: 'Professional certification in information systems security, covering domains and best practices.',
      skills: ['Security Architecture', 'Access Control', 'Cryptography'],
    },
  ]

  const projects = [
    {
      title: 'AnonyMikeTech Platform',
      description: 'Full-stack digital services platform with AI integration, offering web development, social media management, and chatbot solutions. Built with modern technologies for scalability and performance.',
      category: 'development',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'AI APIs'],
      link: 'https://www.anonymiketech.online',
      icon: '🚀',
    },
    {
      title: 'AI Chatbot Solutions',
      description: 'Integrated ChatGPT-powered chatbots for business automation and customer engagement across web platforms. Provides intelligent conversation flows and seamless integration.',
      category: 'ai',
      tags: ['OpenAI', 'Node.js', 'Express', 'React', 'LLMs'],
      link: 'https://www.anonymiketech.online/chatbots-ai',
      icon: '🤖',
    },
    {
      title: 'Social Media Campaign Management',
      description: 'Managed and executed successful social media campaigns with growth strategies and content optimization. Achieved measurable engagement and audience growth across platforms.',
      category: 'marketing',
      tags: ['Analytics', 'Strategy', 'Content Creation', 'Engagement', 'Growth'],
      link: 'https://www.anonymiketech.online/social-media-boosting',
      icon: '📱',
    },
    {
      title: 'Internet Service Solutions',
      description: 'Provided technical consulting and optimization services for internet connectivity and network infrastructure. Enhanced performance and reliability for enterprise clients.',
      category: 'services',
      tags: ['Networking', 'Consulting', 'Infrastructure', 'Optimization', 'Support'],
      link: 'https://www.anonymiketech.online/internet-services',
      icon: '🌐',
    },
    {
      title: 'Web Development Services',
      description: 'Custom web development for diverse client needs, from responsive websites to complex web applications. Focused on user experience, performance, and maintainability.',
      category: 'development',
      tags: ['Frontend', 'Backend', 'Full Stack', 'Responsive', 'SEO'],
      link: 'https://www.anonymiketech.online/web-development',
      icon: '💻',
    },
  ]

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <>
      {showLoader && <PortfolioLoader onComplete={() => setShowLoader(false)} />}
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-32 pb-20">
        {/* Hero Section */}
        <motion.section initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-40 animate-pulse" />
                <div className="relative bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-3xl p-3 border-2 border-emerald-400/50 overflow-hidden shadow-2xl">
                  <Image
                    src="/michael-profile.jpg"
                    alt="MICHAEL MSHILA"
                    width={320}
                    height={320}
                    className="w-full h-full rounded-2xl object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div variants={containerVariants} className="text-center md:text-left">
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-white mb-4 font-tech">
                {profile.name}
              </motion.h1>

              <motion.p variants={itemVariants} className="text-2xl text-emerald-400 font-semibold mb-6">
                {profile.role}
              </motion.p>

              <motion.p variants={itemVariants} className="text-lg text-gray-300 leading-relaxed mb-8">
                {profile.bio}
              </motion.p>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="flex gap-4 justify-center md:justify-start mb-8">
                {socials.map((social, idx) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      href={social.url}
                      key={idx}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        className={`p-3 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 hover:border-emerald-400 group-hover:bg-gradient-to-br group-hover:from-emerald-400/40 group-hover:to-cyan-400/40 transition-all ${social.color}`}
                      >
                        <IconComponent className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                    </a>
                  )
                })}
              </motion.div>

              <motion.a
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:anonymiketech@gmail.com"
                className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white font-tech font-bold hover:shadow-lg hover:shadow-emerald-400/50 transition-all"
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-24"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-12 font-tech">
            Skills & Expertise
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-400/30 hover:border-emerald-400 transition-all h-full p-6">
                  <h3 className="text-lg font-bold text-white mb-4">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item, i) => (
                      <Badge key={i} className="bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30 border-emerald-400/50">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-24"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-12 font-tech">
            Education & Training
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutions.map((inst, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30 hover:border-cyan-400 transition-all h-full p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-cyan-400/20 text-cyan-300">{inst.type}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{inst.name}</h3>
                  <p className="text-emerald-400 font-semibold mb-2">{inst.field}</p>
                  <p className="text-gray-400 text-sm">{inst.duration}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certificates Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-24"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-12 font-tech">
            Certifications & Credentials
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border-2 border-violet-400/30 hover:border-violet-400 transition-all h-full p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Badge className="bg-violet-400/20 text-violet-300 border-violet-400/50 mb-3">{cert.date}</Badge>
                        <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                        <p className="text-violet-300 font-semibold text-sm">{cert.issuer}</p>
                      </div>
                      <div className="text-4xl ml-4">🏆</div>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm">{cert.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, i) => (
                        <Badge key={i} className="bg-violet-400/30 text-violet-200 border-violet-400/50 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-24"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-12 font-tech">
            Featured Projects
          </motion.h2>

          {/* Filter Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-12 justify-center">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'development', label: 'Development' },
              { id: 'ai', label: 'AI Solutions' },
              { id: 'marketing', label: 'Marketing' },
              { id: 'services', label: 'Services' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeFilter === cat.id
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black'
                    : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 hover:border-emerald-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-emerald-500/15 border-2 border-blue-400/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-400/30 transition-all h-full p-8 flex flex-col group relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-cyan-400/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{project.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 flex-grow leading-relaxed text-base">{project.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-blue-400/30 to-cyan-400/30 text-blue-200 border-blue-400/60 text-xs font-semibold group-hover:from-emerald-400/40 group-hover:to-cyan-400/40 group-hover:text-emerald-200 transition-all"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* View Project Link */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-400 hover:text-cyan-400 transition-all font-bold text-lg group/link"
                    >
                      <span className="relative">
                        View Project
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover/link:w-full transition-all" />
                      </span>
                      <ExternalLink className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 border border-emerald-400/30 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-tech">Ready to Work Together?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Let's create something amazing. Get in touch and let's discuss your next project.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:anonymiketech@gmail.com"
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white font-tech font-bold hover:shadow-lg hover:shadow-emerald-400/50 transition-all"
            >
              Send Me an Email
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Admin Access */}
        <div className="container mx-auto px-4 flex justify-center pb-8">
          <Link href="/admin">
            <motion.button
              whileHover={{ scale: 1.05, opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-500 hover:text-slate-400 hover:border-slate-600 transition-all text-xs font-medium"
            >
              <Settings className="w-3 h-3" />
              Admin
            </motion.button>
          </Link>
        </div>

        <BackToTop />
      </main>
    </>
  )
}
