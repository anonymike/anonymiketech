"use client"

import { motion } from "framer-motion" 
import { Globe, Apple, Smartphone } from "lucide-react"
import { useState } from "react"

const platforms = [
  {
    id: "web",
    name: "Web",
    icon: Globe,
    description: "Build web experiences",
  },
  {
    id: "apple",
    name: "Apple",
    icon: Apple,
    description: "iOS applications",
  },
  {
    id: "android",
    name: "Android",
    icon: Smartphone,
    description: "Android apps",
  },
]

const codeExample = `<!-- Import Spline Viewer -->
<script type="module"
  src="https://unpkg.com/@splinetool/viewer@1.9.82/build/...">
</script>

<!-- Add your 3D scene using the spline-viewer component -->
<spline-viewer
  url="https://prod.spline.design/9951u9cumiw2Ehj8/scene">
</spline-viewer>`

export default function MultiPlatformSection() {
  const [activePlatform, setActivePlatform] = useState("web")

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ship real-time experiences to the Web, iOS and Android
          </h2>
          <p className="text-gray-400 text-lg">
            A multi-platform solution to seamlessly integrate interactive 3D experiences into your websites, apps, and digital products.
          </p>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center gap-4 md:gap-8 mb-16 md:mb-24 flex-wrap"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon
            return (
              <motion.button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activePlatform === platform.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {platform.name}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-gray-800 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-gray-900/50 to-gray-950/50"
          >
            <p className="text-gray-400 text-sm mb-8">Press and drag to interact</p>
            
            {/* Interactive preview placeholder */}
            <div className="space-y-6">
              <div className="h-40 md:h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-400">3D Preview Area</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-16 bg-red-500 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-red-500/50 transition-all"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-16 bg-blue-500 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Code Example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="text-sm font-semibold text-gray-400 bg-gray-900/50 rounded-t-lg px-4 py-2 border-b border-gray-800">
              Webflow Project
            </div>
            
            <div className="border border-gray-800 rounded-b-2xl bg-gray-950/80 p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300 leading-relaxed">
                {codeExample.split("\n").map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-gray-600 flex-shrink-0 w-6 text-right">{i + 1}</span>
                    <span>
                      {line.split(/(<[^>]*>|"[^"]*"|\/\*.*\*\/)/g).map((part, j) => {
                        if (part.startsWith("<")) return <span key={j} className="text-blue-400">{part}</span>
                        if (part.startsWith('"')) return <span key={j} className="text-yellow-400">{part}</span>
                        if (part.startsWith("/*")) return <span key={j} className="text-green-600">{part}</span>
                        return <span key={j}>{part}</span>
                      })}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
