"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"

export default function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; text: string }>>([
    { type: "bot", text: "Hey! How can ANONYMIKETECH help you today? 🚀" },
  ])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("anonymiketech_intro_seen")
    if (hasSeenIntro) {
      setShowChat(true)
    } else {
      const timer = setTimeout(() => {
        setShowChat(true)
      }, 8500) // Shows after intro completes
      return () => clearTimeout(timer)
    }
  }, [])

  // Show label periodically
  useEffect(() => {
    if (!showChat) return

    const interval = setInterval(() => {
      setShowLabel(true)
      setTimeout(() => setShowLabel(false), 4000)
    }, 10000)
    return () => clearInterval(interval)
  }, [showChat])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    setMessages((prev) => [...prev, { type: "user", text: inputValue }])

    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! Let me help you with that. 💻",
        "Interesting! Tell me more about what you need. 🔧",
        "That's a great question! We can definitely help with that. ⚡",
        "I'm forwarding your request to our team. One moment... 👨‍💻",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { type: "bot", text: randomResponse }])
    }, 1000)

    setInputValue("")
  }

  if (!showChat) return null

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ x: "calc(100% - 60px)" }}
        animate={{ x: "calc(100% - 60px)" }}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
      >
        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-20 rounded-l-full bg-gradient-to-b from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
            }}
          >
            <MessageCircle className="w-6 h-6 text-black" />
          </motion.button>

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="absolute inset-0 rounded-l-full border-2 border-cyan-400 pointer-events-none"
          />

          <AnimatePresence>
            {showLabel && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-b from-blue-600/90 to-blue-700/90 border border-cyan-400 rounded-lg px-4 py-3 whitespace-nowrap shadow-lg backdrop-blur-sm"
              >
                <div className="text-sm font-tech text-cyan-300 font-semibold">💬 Need Help?</div>
                <div className="text-xs font-tech text-cyan-200">Chat with ANONYMIKE</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-32 right-6 z-40 w-96 max-w-[calc(100vw-24px)] rounded-lg overflow-hidden shadow-2xl"
            style={{
              boxShadow: "0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 150, 200, 0.1)",
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-tech text-white font-bold">ANONYMIKETECH Support</h3>
                <p className="text-xs text-cyan-200">Always here to help 🚀</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-cyan-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="bg-gray-900/80 backdrop-blur-sm h-64 overflow-y-auto p-4 space-y-4 border-b border-cyan-500/30">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.type === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg font-tech text-sm ${
                      msg.type === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-blue-600/50 text-cyan-200 border border-cyan-400/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-3 flex gap-2 border-t border-cyan-500/30">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-cyan-400/50 rounded px-3 py-2 text-white font-tech text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded font-tech font-bold transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
