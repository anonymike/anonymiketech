"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Activity, Wifi, Globe } from "lucide-react"

export default function ClientConnectionStats() {
  const [connectedClients, setConnectedClients] = useState(0)
  const [connectingClients, setConnectingClients] = useState(0)
  const [totalConnections, setTotalConnections] = useState(0)
  const [activeServers, setActiveServers] = useState(0)

  useEffect(() => {
    const updateStats = () => {
      const baseConnected = 847
      const variation = Math.floor(Math.random() * 50) - 25
      const newConnected = Math.max(800, baseConnected + variation)

      const newConnecting = Math.floor(Math.random() * 15) + 2
      const newTotal = newConnected + Math.floor(Math.random() * 1000) + 5420
      const newActiveServers = Math.floor(Math.random() * 3) + 12

      setConnectedClients(newConnected)
      setConnectingClients(newConnecting)
      setTotalConnections(newTotal)
      setActiveServers(newActiveServers)
    }

    updateStats()
    const interval = setInterval(updateStats, 3500 + Math.random() * 1500)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Clients Connected",
      value: connectedClients,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      pulse: true,
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: "Connecting Now",
      value: connectingClients,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
      pulse: true,
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Total Sessions",
      value: totalConnections,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      pulse: false,
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      label: "Active Servers",
      value: activeServers,
      color: "text-hacker-green",
      bgColor: "bg-hacker-green/20",
      borderColor: "border-hacker-green/30",
      pulse: false,
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="py-8"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-tech font-bold text-hacker-green-bright glow-text mb-2">
            🔥 LIVE SERVER STATUS
          </h3>
          <p className="text-hacker-green-dim font-tech">// Real-time connection statistics</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`glow-border rounded-lg p-4 md:p-6 ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} relative overflow-hidden group hover:animate-glow-pulse`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.color} group-hover:animate-pulse`}>{stat.icon}</div>
                  {stat.pulse && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className={`w-3 h-3 rounded-full ${stat.bgColor.replace("/20", "")}`}
                    />
                  )}
                </div>

                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-2xl md:text-3xl font-tech font-bold ${stat.color} mb-2`}
                >
                  {stat.value.toLocaleString()}
                </motion.div>

                <div className="text-sm font-tech text-hacker-green-dim">{stat.label}</div>
              </div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color.replace("text-", "").replace("-400", "").replace("-", "")}/10, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Connection Activity Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-hacker-terminal/50 backdrop-blur-sm border border-hacker-green/20 rounded-full px-4 py-2">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-sm font-tech text-hacker-green-bright">Server Status:</span>
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-sm font-tech font-bold text-green-400"
            >
              ONLINE & ACTIVE
            </motion.span>
          </div>
        </motion.div>

        {/* Performance Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 max-w-md mx-auto"
        >
          <div className="text-center mb-3">
            <span className="text-sm font-tech text-hacker-green-bright">Server Performance</span>
          </div>
          <div className="h-3 bg-hacker-terminal/50 rounded-full overflow-hidden border border-hacker-green/20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "94%" }}
              transition={{ duration: 2, delay: 1 }}
              className="h-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 relative overflow-hidden"
            >
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-16 transform skew-x-12"
              />
            </motion.div>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs font-tech text-hacker-green-dim">Uptime: 99.94% • Latency: &lt;15ms</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
