'use client'

import { motion } from 'framer-motion'
import { useTypingAnimation } from '@/hooks/useTypingAnimation'

interface TypingTextProps {
  words: string[]
  className?: string
  startDelay?: number
  typingSpeed?: number
  cursorVisible?: boolean
}

export default function TypingText({
  words,
  className = '',
  startDelay = 0,
  typingSpeed = 50,
  cursorVisible = false,
}: TypingTextProps) {
  const displayedWords = useTypingAnimation(words, startDelay, typingSpeed)

  return (
    <span className={className}>
      {displayedWords.map((word, index) => (
        <span key={index}>
          {word.text}
          {word.isTyping && cursorVisible && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block w-2 h-4 ml-0.5 bg-current"
            />
          )}
          {index < displayedWords.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}
