"use client"

import { motion } from "framer-motion"

export default function NetworkTopology() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-black/40 border border-cyan-500/40 rounded-lg p-8 overflow-x-auto font-mono text-xs sm:text-sm"
    >
      <div className="min-w-max">
        {/* Header */}
        <div className="text-cyan-400 mb-8">
          <div className="flex items-start">
            <span className="text-cyan-300">┌─ NETWORK TOPOLOGY</span>
          </div>
          <div className="flex items-start ml-2">
            <span className="text-cyan-400">└─ 45m × 1 Floor(s)</span>
          </div>
        </div>

        {/* Internet Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-green-400">
              <div>┌─────────────────────┐</div>
              <div>│      INTERNET       │</div>
              <div>│   KES 2,000/mo      │</div>
              <div>└─────────────────────┘</div>
            </div>
          </div>

          {/* Split to Controllers */}
          <div className="ml-4 mb-6">
            <div className="text-cyan-400">│</div>
            <div className="flex items-start gap-8">
              {/* MikroTik */}
              <div>
                <div className="text-yellow-400 mb-2">├─ ┌──────────────────┐</div>
                <div className="text-yellow-400">│  │  MikroTik RB951  │</div>
                <div className="text-yellow-400">│  └──────────────────┘</div>
              </div>

              {/* Hotspot */}
              <div>
                <div className="text-purple-400 mb-2">├─ ┌──────────────────┐</div>
                <div className="text-purple-400">│  │ Hotspot Control  │</div>
                <div className="text-purple-400">│  └──────────────────┘</div>
              </div>
            </div>
          </div>

          {/* LAN Section */}
          <div className="ml-4">
            <div className="text-cyan-400">│</div>
            <div className="text-cyan-400 mb-2">└─ ┌─────────────┐</div>
            <div className="text-cyan-400 mb-2">   │     LAN    │</div>
            <div className="text-cyan-400 mb-4">   └─────────────┘</div>

            {/* Tenda Devices */}
            <div className="ml-6 space-y-3">
              <div className="text-blue-400">
                <span>├─ [Tenda 1] ))) ~15m</span>
              </div>
              <div className="text-blue-400">
                <span>├─ [Tenda 2] ))) ~15m</span>
              </div>
              <div className="text-blue-400">
                <span>└─ [Tenda 3] ))) ~15m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-cyan-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-green-400">●</span>
            <span className="text-cyan-400 ml-2">Main ISP</span>
          </div>
          <div>
            <span className="text-yellow-400">●</span>
            <span className="text-cyan-400 ml-2">Router</span>
          </div>
          <div>
            <span className="text-purple-400">●</span>
            <span className="text-cyan-400 ml-2">Controller</span>
          </div>
          <div>
            <span className="text-blue-400">●</span>
            <span className="text-cyan-400 ml-2">Access Points</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
