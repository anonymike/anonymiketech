'use client'

import { motion } from 'framer-motion'
import { LogOut, Settings, Menu, X, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

interface AdminNavbarProps {
  activeTab: string
  onLogout: () => void
}

export default function AdminNavbar({ activeTab, onLogout }: AdminNavbarProps) {
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
        className="hidden lg:block fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-emerald-500/30 backdrop-blur-md"
      >
        <div className="h-16 px-8 flex items-center justify-between">
          {/* Left Section - Logo and Current Tab */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ADMIN</h1>
                <p className="text-xs text-emerald-400 font-mono">Panel</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-emerald-500/30" />

            {/* Current Tab Display */}
            <div className="text-sm">
              <p className="text-emerald-400 font-mono text-xs">CURRENT VIEW</p>
              <p className="text-white font-bold">{getTabLabel()}</p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all font-medium text-sm"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 origin-left"
          style={{ transformOrigin: 'left' }}
        />
      </motion.nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald-500/30 backdrop-blur-md">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold text-white">ADMIN</h1>
          </div>

          {/* Center - Current Tab */}
          <div className="text-center flex-1 mx-4">
            <p className="text-xs text-emerald-400 font-mono">VIEW</p>
            <p className="text-xs font-bold text-white truncate">{getTabLabel()}</p>
          </div>

          {/* Right - Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden border-t border-emerald-500/20 bg-slate-800/50 ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="px-4 py-4 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsMenuOpen(false)
                onLogout()
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="hidden lg:block h-16" />
      <div className="lg:hidden h-14" />
    </>
  )
}
