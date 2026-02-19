"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: "all", label: "Dashboard", icon: LayoutDashboard },
    { id: "services", label: "Services", icon: Package },
    { id: "website", label: "Website Orders", icon: ShoppingCart },
    { id: "social-media", label: "Social Media Orders", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-emerald-400"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-emerald-500/20 z-40 lg:static lg:translate-x-0 overflow-y-auto"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ANONYMIKE</h1>
              <p className="text-xs text-emerald-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400"
                    : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/20 bg-gradient-to-t from-slate-900 to-transparent">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
