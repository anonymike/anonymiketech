import { useEffect, useState } from 'react'

interface TypedWord {
  text: string
  isTyping: boolean
  complete: boolean
}

export function useTypingAnimation(words: string[], startDelay: number = 0, typingSpeed: number = 50) {
  const [displayedWords, setDisplayedWords] = useState<TypedWord[]>(
    words.map(word => ({ text: '', isTyping: false, complete: false }))
  )

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let currentWordIndex = 0
    let currentCharIndex = 0

    const typeCharacter = () => {
      const word = words[currentWordIndex]
      
      if (currentCharIndex < word.length) {
        setDisplayedWords(prev => {
          const newWords = [...prev]
          // Keep all previously completed words
          for (let i = 0; i < currentWordIndex; i++) {
            newWords[i] = { text: words[i], isTyping: false, complete: true }
          }
          // Type the current word
          newWords[currentWordIndex] = {
            text: word.substring(0, currentCharIndex + 1),
            isTyping: true,
            complete: false
          }
          return newWords
        })
        currentCharIndex++
        timers.push(setTimeout(typeCharacter, typingSpeed))
      } else {
        // Word is complete, move to next
        setDisplayedWords(prev => {
          const newWords = [...prev]
          newWords[currentWordIndex] = {
            text: words[currentWordIndex],
            isTyping: false,
            complete: true
          }
          return newWords
        })
        
        currentWordIndex++
        currentCharIndex = 0
        
        if (currentWordIndex < words.length) {
          timers.push(setTimeout(typeCharacter, 100))
        }
      }
    }

    timers.push(setTimeout(typeCharacter, startDelay))

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [words, startDelay, typingSpeed])

  return displayedWords
}
