'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, Menu, X, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

interface AdminNavbarProps {
  activeTab: string
  onLogout: () => void
  adminImage?: string | null
}

export default function AdminNavbar({ activeTab, onLogout, adminImage }: AdminNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getTabLabel = () => {
    const labels: { [key: string]: string } = {
      all: 'Dashboard',
      website: 'Website Orders',
      'social-media': 'Social Media Orders',
      services: 'Services Management',
      'premium-apps': 'Premium Apps',
      settings: 'Settings',
    }
    return labels[activeTab] || 'Dashboard'
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden lg:block fixed top-0 left-0 right-0 z-30 bg-slate-950/95 border-b border-emerald-500/20 backdrop-blur-lg"
      >
        <div className="h-20 px-8 flex items-center justify-between">
          {/* Left Section - Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:rotate-6 transition-transform">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">ADMIN PANEL</h1>
              <p className="text-xs text-emerald-400 font-mono">Management System</p>
            </div>
          </motion.div>

          {/* Center - Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-emerald-500/10">
              <span className="text-emerald-400 text-sm font-mono">VIEW:</span>
              <span className="text-white font-bold text-sm ml-2">{getTabLabel()}</span>
            </div>
          </div>

          {/* Right Section - Admin Image & Actions */}
          <div className="flex items-center gap-6">
            {/* Admin Profile Image - Circular */}
            {adminImage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-emerald-400/50 hover:border-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 cursor-pointer group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adminImage}
                  alt="Admin profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 text-red-400 hover:border-red-500/60 transition-all font-medium text-sm hover:shadow-lg hover:shadow-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Animated bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent origin-left"
          style={{ transformOrigin: 'left' }}
        />
      </motion.nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-950/95 border-b border-emerald-500/20 backdrop-blur-lg">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          {/* Left - Logo & Text */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white leading-tight">ADMIN</h1>
              <p className="text-xs text-emerald-400 font-mono">Panel</p>
            </div>
          </div>

          {/* Center - Current Tab */}
          <div className="text-center flex-1 min-w-0 mx-1">
            <p className="text-xs text-emerald-400 font-mono">VIEW</p>
            <p className="text-xs font-bold text-white truncate">{getTabLabel()}</p>
          </div>

          {/* Right - Menu Toggle Hamburger */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 hover:border-emerald-500/60 transition-all flex-shrink-0"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-16 left-0 right-0 border-b border-emerald-500/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-lg shadow-xl shadow-slate-950/50"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMenuOpen(false)
                    onLogout()
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 text-red-400 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20 font-medium text-sm transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="hidden lg:block h-16" />
      <div className="lg:hidden h-14" />
    </>
  )
}
