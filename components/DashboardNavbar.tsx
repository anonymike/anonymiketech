'use client'

import { useState } from 'react'
import { Menu, X, LogOut, User, Coins, Share2, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardNavbarProps {
  username: string
  coinBalance: number
  onLogout: () => void
  onProfileClick: () => void
  activeTab: 'bots' | 'deploy' | 'profile' | 'referral'
  onTabChange: (tab: 'bots' | 'deploy' | 'profile' | 'referral') => void
}

export default function DashboardNavbar({
  username,
  coinBalance,
  onLogout,
  onProfileClick,
  activeTab,
  onTabChange,
}: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'bots' as const, label: 'Bots', icon: Home },
    { id: 'deploy' as const, label: 'Deploy', icon: Share2 },
    { id: 'referral' as const, label: 'Referrals', icon: Share2 },
  ]

  const handleTabClick = (tab: 'bots' | 'deploy' | 'profile' | 'referral') => {
    onTabChange(tab)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-cyan-400 font-tech">
              Dashboard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Coin Balance */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 border border-yellow-500/30">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-xs sm:text-sm font-semibold text-yellow-400">
                {coinBalance}
              </span>
            </div>

            {/* Profile Button - Desktop */}
            <button
              onClick={onProfileClick}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium truncate max-w-[100px]">
                {username}
              </span>
            </button>

            {/* Logout Button - Desktop */}
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-700 bg-slate-900/50 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Coin Balance Mobile */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-yellow-500/30 mb-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">
                    {coinBalance} coins
                  </span>
                </div>

                {/* Navigation Items Mobile */}
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-slate-700 my-3" />

                {/* User Actions Mobile */}
                <button
                  onClick={() => {
                    onProfileClick()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  {username}
                </button>

                <button
                  onClick={() => {
                    onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
