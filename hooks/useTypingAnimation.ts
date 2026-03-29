import { useEffect, useState } from 'react'

interface TypedWord {
  text: string
  isTyping: boolean
}

export function useTypingAnimation(words: string[], startDelay: number = 0, typingSpeed: number = 50) {
  const [displayedWords, setDisplayedWords] = useState<TypedWord[]>(
    words.map(word => ({ text: '', isTyping: false }))
  )

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let currentIndex = 0
    let currentCharIndex = 0

    const typeWord = (wordIndex: number) => {
      const word = words[wordIndex]
      
      const typeCharacter = () => {
        if (currentCharIndex <= word.length) {
          setDisplayedWords(prev => {
            const newWords = [...prev]
            newWords[wordIndex] = {
              text: word.substring(0, currentCharIndex),
              isTyping: currentCharIndex < word.length
            }
            return newWords
          })
          currentCharIndex++
          
          if (currentCharIndex <= word.length) {
            timers.push(
              setTimeout(typeCharacter, typingSpeed)
            )
          } else {
            // Move to next word
            currentCharIndex = 0
            currentIndex++
            if (currentIndex < words.length) {
              timers.push(
                setTimeout(() => typeWord(currentIndex), 300)
              )
            }
          }
        }
      }

      typeCharacter()
    }

    timers.push(
      setTimeout(() => typeWord(0), startDelay)
    )

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [words, startDelay, typingSpeed])

  return displayedWords
}
