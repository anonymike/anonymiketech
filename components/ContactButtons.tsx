"use client"

import { motion } from "framer-motion"
import { MessageCircle, Send, Users, Radio } from "lucide-react"

const contactLinks = [
  {
    name: "WhatsApp Inbox",
    url: "https://wa.me/+254113313240",
    icon: <MessageCircle className="w-6 h-6" />,
    description: "Chat directly",
  },
  {
    name: "Telegram Inbox",
    url: "https://t.me/ANONYMIKEY",
    icon: <Send className="w-6 h-6" />,
    description: "Private messages",
  },
  {
    name: "Telegram Channel",
    url: "https://t.me/+GNlDIzf7_oQ1N2M0",
    icon: <Radio className="w-6 h-6" />,
    description: "Latest updates",
  },
  {
    name: "WhatsApp Channel",
    url: "https://whatsapp.com/channel/0029Vb4woXa17En19MxCLg32",
    icon: <Users className="w-6 h-6" />,
    description: "Community",
  },
]

export default function ContactButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactLinks.map((link, index) => (
        <motion.a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 25px hsl(var(--hacker-green))",
          }}
          whileTap={{ scale: 0.95 }}
          className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300 text-center group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="text-hacker-green group-hover:text-hacker-bg group-hover:animate-pulse">{link.icon}</div>
            <h4 className="font-bold text-hacker-green-bright group-hover:text-hacker-bg font-tech">{link.name}</h4>
            <p className="text-sm text-hacker-green-dim group-hover:text-hacker-bg/80">{link.description}</p>
          </div>
        </motion.a>
      ))}
    </div>
  )
}
