"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

const technologies = [
  { 
    name: "React", 
    icon: "⚛️", 
    color: "from-cyan-400 to-blue-500",
    code: `import React from 'react';\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;` 
  },
  { 
    name: "Next.js", 
    icon: "▲", 
    color: "from-gray-400 to-gray-600",
    code: `import Link from 'next/link';\n\nexport default function Home() {\n  return (\n    <Link href="/about">\n      About\n    </Link>\n  );\n}`
  },
  { 
    name: "Node.js", 
    icon: "⬢", 
    color: "from-green-400 to-green-600",
    code: `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello from Node!');\n});\n\napp.listen(3000);`
  },
  { 
    name: "TypeScript", 
    icon: "TS", 
    color: "from-blue-400 to-blue-600",
    code: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction getUser(id: number): User {\n  return { id, name: 'John', email: 'john@example.com' };\n}`
  },
  { 
    name: "MongoDB", 
    icon: "🍃", 
    color: "from-green-400 to-emerald-600",
    code: `db.users.insertOne({\n  name: "John Doe",\n  email: "john@example.com",\n  age: 30\n});\n\ndb.users.find({ name: "John Doe" });`
  },
  { 
    name: "PostgreSQL", 
    icon: "🐘", 
    color: "from-blue-400 to-blue-600",
    code: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100)\n);\n\nSELECT * FROM users\nWHERE name = 'John Doe';`
  },
  { 
    name: "Docker", 
    icon: "🐳", 
    color: "from-blue-400 to-cyan-500",
    code: `FROM node:18-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]`
  },
  { 
    name: "Git", 
    icon: "🔗", 
    color: "from-orange-400 to-red-600",
    code: `git init\ngit add .\ngit commit -m "Initial commit"\ngit branch feature/new-feature\ngit checkout feature/new-feature\ngit push origin feature/new-feature`
  },
]

type TypeEffect = {
  text: string
  index: number
}

export default function TechStackSection({ delay = 5.5 }: { delay?: number }) {
  const [showContent, setShowContent] = useState(false)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [displayedCode, setDisplayedCode] = useState<TypeEffect>({ text: "", index: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  // Terminal typing effect
  useEffect(() => {
    if (!selectedTech) {
      setDisplayedCode({ text: "", index: 0 })
      return
    }

    const selectedTechData = technologies.find((t) => t.name === selectedTech)
    if (!selectedTechData) return

    const fullCode = selectedTechData.code
    let currentIndex = displayedCode.index

    if (currentIndex < fullCode.length) {
      const timer = setTimeout(() => {
        setDisplayedCode({
          text: fullCode.substring(0, currentIndex + 1),
          index: currentIndex + 1,
        })
      }, 20)
      return () => clearTimeout(timer)
    }
  }, [selectedTech, displayedCode])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
      transition={{ duration: 1 }}
      className="container mx-auto px-4 mb-16"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 glow-text"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        // TECH STACK & EXPERTISE
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {technologies.map((tech, index) => {
          const isTopRow = index < 4
          const xOffset = isTopRow ? 50 : -50

          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.5, rotateZ: -10, x: -xOffset }}
              animate={{ opacity: 1, scale: 1, rotateZ: 0, x: 0 }}
              transition={{
                delay: delay + 0.1 * index,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 30px rgba(0, 255, 0, 0.6)",
                y: -5,
              }}
              onClick={() => setSelectedTech(tech.name)}
              className="relative group cursor-pointer"
            >
            <div
              className={`glow-border rounded-lg p-6 bg-gradient-to-br ${tech.color} bg-opacity-10 backdrop-blur-sm h-full flex items-center justify-center cursor-pointer`}
            >
              <motion.div
                animate={{
                  rotateZ: [0, 5, -5, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
                className="text-center"
              >
                <div className={`text-5xl mb-3 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.icon}
                </div>
                <h3 className="font-tech font-bold text-hacker-green-bright text-sm">{tech.name}</h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 rounded-lg bg-hacker-green/10 blur-lg -z-10"
              />
            </div>
            </motion.div>
          )
        })}
      </div>

      {/* Code Modal */}
      {selectedTech && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTech(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-hacker-terminal border-2 border-hacker-green/40 rounded-lg w-full max-w-2xl max-h-96 overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="bg-hacker-terminal-dark border-b border-hacker-green/20 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="font-tech text-hacker-green text-xs">
                {selectedTech}.{selectedTech === "MongoDB" ? "js" : selectedTech === "PostgreSQL" ? "sql" : selectedTech === "Docker" ? "dockerfile" : "js"}
              </span>
              <button
                onClick={() => setSelectedTech(null)}
                className="text-hacker-green hover:text-hacker-green-bright transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-6 overflow-y-auto max-h-80">
              <pre className="font-tech text-hacker-green text-sm leading-relaxed whitespace-pre-wrap break-words">
                <code>{displayedCode.text}</code>
                {displayedCode.index < (technologies.find((t) => t.name === selectedTech)?.code || "").length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block w-2 h-5 bg-hacker-green ml-1"
                  />
                )}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ delay: delay + 1, duration: 1 }}
        className="text-center text-hacker-green-dim mt-8 font-tech text-sm md:text-base"
      >
        // Cutting-edge technologies for next-generation solutions
      </motion.p>
    </motion.section>
  )
}
