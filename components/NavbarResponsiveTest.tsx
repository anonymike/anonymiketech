'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Monitor, Smartphone, Tablet } from 'lucide-react'

export default function NavbarResponsiveTest() {
  const [showTest, setShowTest] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  const devices = {
    mobile: { width: 375, height: 812, label: 'Mobile (iPhone)', icon: Smartphone },
    tablet: { width: 768, height: 1024, label: 'Tablet (iPad)', icon: Tablet },
    desktop: { width: 1920, height: 1080, label: 'Desktop', icon: Monitor },
  }

  const currentDevice = devices[selectedDevice]
  const CurrentIcon = currentDevice.icon

  return (
    <>
      {/* Test Button - Fixed at bottom right */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTest(!showTest)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal shadow-lg shadow-hacker-green/50 hover:shadow-xl hover:shadow-hacker-green/70 transition-all"
        title="Test navbar responsiveness"
      >
        {showTest ? <EyeOff size={24} /> : <Eye size={24} />}
      </motion.button>

      {/* Test Modal */}
      <AnimatePresence>
        {showTest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowTest(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-hacker-terminal border border-hacker-green/40 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-hacker-green font-tech">
                  Navbar Responsive Test
                </h2>
                <button
                  onClick={() => setShowTest(false)}
                  className="text-hacker-green-dim hover:text-hacker-green transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Device Selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.entries(devices).map(([key, device]) => {
                  const Icon = device.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDevice(key as 'mobile' | 'tablet' | 'desktop')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        selectedDevice === key
                          ? 'border-hacker-green bg-hacker-green/20'
                          : 'border-hacker-green/30 bg-hacker-green/5 hover:border-hacker-green/60'
                      }`}
                    >
                      <Icon size={24} className="text-hacker-green" />
                      <span className="text-xs sm:text-sm font-mono text-hacker-green">{device.label}</span>
                      <span className="text-xs text-hacker-green-dim">{device.width}x{device.height}</span>
                    </button>
                  )
                })}
              </div>

              {/* Preview */}
              <div className="bg-black rounded-lg p-4 border border-hacker-green/20 overflow-x-auto">
                <div
                  className="mx-auto border-8 border-gray-800 rounded-lg shadow-2xl bg-white overflow-hidden"
                  style={{
                    width: `${currentDevice.width}px`,
                    height: `${currentDevice.height}px`,
                  }}
                >
                  <iframe
                    src="/"
                    className="w-full h-full border-none"
                    title={`Navbar preview for ${currentDevice.label}`}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-hacker-green/10 border border-hacker-green/30 rounded-lg">
                <p className="text-sm text-hacker-green-dim font-mono mb-2">
                  <strong className="text-hacker-green">Testing Device:</strong> {currentDevice.label}
                </p>
                <p className="text-xs text-hacker-green-dim font-mono">
                  Use this tool to verify navbar responsiveness across different screen sizes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
