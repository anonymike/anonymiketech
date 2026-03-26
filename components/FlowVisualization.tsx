'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface FlowStep {
  id: number
  title: string
  description: string
  image: string
}

const flowSteps: FlowStep[] = [
  {
    id: 1,
    title: 'Step 1: Pair Code Countdown',
    description: 'Your pairing process begins with a secure connection request. The system initiates a countdown to establish your session.',
    image: '/images/flow/first-step.jpg',
  },
  {
    id: 2,
    title: 'Step 2: Enter Phone Number',
    description: 'Provide your WhatsApp number with the country code. This identifies your account for the pairing process.',
    image: '/images/flow/second-step.jpg',
  },
  {
    id: 3,
    title: 'Step 3: Get Pairing Code',
    description: 'Receive your unique TECH-WORD code. Copy it or open the WhatsApp link to send it to our TRUTH MD bot.',
    image: '/images/flow/third-step.jpg',
  },
  {
    id: 4,
    title: 'Step 4: Validate Session',
    description: 'Once you receive your session ID from TRUTH MD, paste it here to validate and unlock full deployment capabilities.',
    image: '/images/flow/fourth-step.jpg',
  },
]

export default function FlowVisualization() {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % flowSteps.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const handlePrevious = () => {
    setAutoPlay(false)
    setCurrentStep((prev) => (prev - 1 + flowSteps.length) % flowSteps.length)
  }

  const handleNext = () => {
    setAutoPlay(false)
    setCurrentStep((prev) => (prev + 1) % flowSteps.length)
  }

  const goToStep = (index: number) => {
    setAutoPlay(false)
    setCurrentStep(index)
  }

  return (
    <div className="w-full space-y-8 py-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">How to Deploy Your Bot</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow these simple steps to get your TRUTH MD bot running on our platform
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full mx-auto overflow-hidden">
        <div className="relative h-96 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Images Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={flowSteps[currentStep].image}
                alt={flowSteps[currentStep].title}
                fill
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none"></div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-auto">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Step Info Below Image */}
        <motion.div
          key={`info-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center space-y-3"
        >
          <h3 className="text-2xl font-bold text-foreground">
            {flowSteps[currentStep].title}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {flowSteps[currentStep].description}
          </p>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-3">
        {flowSteps.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToStep(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none transition-all"
          >
            <Circle
              className={`h-3 w-3 transition-all ${
                index === currentStep
                  ? 'fill-blue-500 text-blue-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Step Counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {flowSteps.length}
        </p>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onClick={() => (window.location.href = '/chatbots-ai/pairing')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-8"
        >
          Start Pairing Process
        </Button>
        <Button
          variant="outline"
          className="h-12 px-8"
        >
          View Documentation
        </Button>
      </div>
    </div>
  )
}
