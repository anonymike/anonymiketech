'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface LiveChatDemoProps {
  title: string
  category: 'whatsapp' | 'live-chat' | 'telegram'
}

export default function LiveChatDemo({ title, category }: LiveChatDemoProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const demoConversations: Record<string, { initial: ChatMessage[], responses: { user: string; bot: string }[] }> = {
    whatsapp: {
      initial: [
        {
          id: '1',
          text: 'Hi! I need help with my order',
          sender: 'user',
          timestamp: new Date(),
        },
      ],
      responses: [
        {
          user: 'Can you check order #12345?',
          bot: 'Sure! I found order #12345. It was placed on Jan 15 and is currently being prepared. Expected delivery: Jan 18. Would you like tracking details?',
        },
        {
          user: 'Yes please',
          bot: 'Here\'s your tracking link: track.example.com/12345. You can also contact our support team anytime. Is there anything else I can help with?',
        },
        {
          user: 'No, that\'s all thanks!',
          bot: 'You\'re welcome! Thank you for your purchase. Have a great day! 🎉',
        },
      ],
    },
    'live-chat': {
      initial: [
        {
          id: '1',
          text: 'Hello! Do you offer custom website development?',
          sender: 'user',
          timestamp: new Date(),
        },
      ],
      responses: [
        {
          user: 'I need an e-commerce site',
          bot: 'Absolutely! We specialize in e-commerce solutions. Our packages range from $500-$5000 depending on features. Would you like to discuss your specific requirements?',
        },
        {
          user: 'What features are included?',
          bot: 'Our standard package includes: responsive design, payment integration, product catalog, inventory management, and 3 months support. Premium adds: AI chatbot, email marketing, and advanced analytics.',
        },
        {
          user: 'That sounds great!',
          bot: 'Wonderful! I\'m connecting you with our sales team for a detailed consultation. They\'ll be with you shortly! 📞',
        },
      ],
    },
    telegram: {
      initial: [
        {
          id: '1',
          text: '/start',
          sender: 'user',
          timestamp: new Date(),
        },
      ],
      responses: [
        {
          user: '/help',
          bot: 'Here\'s how I can help you:\n• /products - Browse our catalog\n• /support - Get instant support\n• /track - Track your order\n• /promo - View special offers\n\nWhat would you like?',
        },
        {
          user: '/products',
          bot: 'Our top products this week:\n1. Premium Bot Package - $299\n2. Enterprise Solution - $999\n3. Custom Integration - Contact us\n\nReply with number for details!',
        },
        {
          user: '1',
          bot: 'Premium Bot Package includes: WhatsApp integration, 1000 conversations/month, basic analytics, and email support. Schedule a demo? /demo',
        },
      ],
    },
  }

  useEffect(() => {
    // Initialize with first message
    const conversation = demoConversations[category]
    if (conversation) {
      setMessages(conversation.initial)
    }
  }, [category])

  const handleSendMessage = async (messageIndex: number) => {
    const conversation = demoConversations[category]
    if (!conversation || messageIndex >= conversation.responses.length) return

    setIsLoading(true)

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: conversation.responses[messageIndex].user,
      sender: 'user',
      timestamp: new Date(),
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, userMessage])

      // Add bot response after delay
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: conversation.responses[messageIndex].bot,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsLoading(false)
      }, 800)
    }, 300)
  }

  const resetDemo = () => {
    const conversation = demoConversations[category]
    if (conversation) {
      setMessages(conversation.initial)
    }
  }

  return (
    <div className="bg-hacker-terminal border-2 border-hacker-green-dim rounded-lg p-4 flex flex-col h-80 md:h-96 shadow-lg shadow-hacker-green/20 hover:shadow-hacker-green/40 transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hacker-green-dim">
        <MessageCircle className="w-5 h-5 text-hacker-green" />
        <h4 className="font-tech font-bold text-hacker-green-bright text-sm">Live Demo: {title}</h4>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 bg-hacker-bg/30 rounded p-3 border border-hacker-green-dim/30">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-hacker-green-dim text-xs">
              <span>Chat will start here...</span>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-xs font-tech leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-hacker-green text-hacker-bg rounded-br-none'
                      : 'bg-hacker-terminal border border-hacker-green text-hacker-green-bright rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 text-hacker-green-dim text-xs px-3 py-2"
          >
            <span className="text-hacker-green-dim">Bot is typing</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
              ●
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !isLoading && messages.length < demoConversations[category].responses.length * 2 + 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSendMessage(Math.floor((messages.length - 1) / 2))}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-hacker-green text-hacker-bg rounded text-xs font-tech font-bold hover:bg-hacker-green-bright transition-colors disabled:opacity-50"
          >
            Continue Demo →
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetDemo}
            className="w-full py-2 px-3 bg-hacker-terminal border border-hacker-green-dim text-hacker-green-bright rounded text-xs font-tech font-bold hover:border-hacker-green-bright transition-colors"
          >
            Reset Demo
          </motion.button>
        )}
      </div>
    </div>
  )
}
