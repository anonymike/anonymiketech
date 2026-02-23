"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Copy, Share2, ArrowRight, Sparkles, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AIMessageDisplay from "@/components/AIMessageDisplay"
import FloatingFlowers from "@/components/FloatingFlowers"



export default function ValentinePage() {
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [validationToken, setValidationToken] = useState("")
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [showAIMessageDisplay, setShowAIMessageDisplay] = useState(false)
  const { toast } = useToast()

  const MAX_CHARACTERS = 600
  const WARNING_THRESHOLD = 600
  const [validatedCharacters, setValidatedCharacters] = useState(600)
  const [tokenValidated, setTokenValidated] = useState(false)

  // Token pricing table
  const tokenPricing = [
    { amount: "KES 10", characters: 700, description: "10 shillings" },
    { amount: "KES 50", characters: 1500, description: "50 shillings" },
    { amount: "KES 100", characters: 3000, description: "100 shillings" },
    { amount: "KES 500", characters: 10000, description: "500 shillings (Unlimited)" },
  ]

  const validateToken = async (token: string) => {
    if (!token.trim()) {
      toast({
        title: "Enter Token",
        description: "Please enter a valid token",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/valentine/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.toUpperCase() }),
      })

      const data = await response.json()

      if (data.valid) {
        setValidatedCharacters(data.characters)
        setTokenValidated(true)
        toast({
          title: "Token Valid!",
          description: data.message,
        })
      } else {
        toast({
          title: "Invalid Token",
          description: data.error || "Token not found or inactive",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate token",
        variant: "destructive",
      })
    }
  }

  const generateShareLink = async () => {
    if (!recipientName.trim() || !message.trim() || !senderName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your Valentine message",
        variant: "destructive",
      })
      return
    }

    // Check if message exceeds character limit
    if (message.length > MAX_CHARACTERS) {
      if (!validationToken || !tokenValidated) {
        setShowTokenInput(true)
        toast({
          title: "Character Limit Exceeded",
          description: `Your message exceeds ${MAX_CHARACTERS} characters. Please add a token to continue.`,
          variant: "destructive",
        })
        return
      }

      if (message.length > validatedCharacters) {
        toast({
          title: "Message Too Long",
          description: `Your token allows up to ${validatedCharacters} characters. Your message has ${message.length} characters.`,
          variant: "destructive",
        })
        return
      }
    }

    setIsGeneratingLink(true)

    try {
      const encodedData = encodeURIComponent(
        JSON.stringify({
          recipient: recipientName,
          message: message,
          sender: senderName,
          photo: uploadedBlobUrl || null,
          date: new Date().toLocaleDateString(),
          token: validationToken || null,
          characterCount: message.length,
        })
      )

      const link = `${window.location.origin}/valentine/view?data=${encodedData}`

      // Safety check for URL length
      if (link.length > 7500) {
        toast({
          title: "Message Too Long",
          description: "Your message is too long for a shareable link. Please shorten it.",
          variant: "destructive",
        })
        setIsGeneratingLink(false)
        return
      }

      setShareLink(link)
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const generateAIMessage = async () => {
    const missingSender = !senderName.trim()
    const missingRecipient = !recipientName.trim()

    if (missingSender || missingRecipient) {
      const missing = missingSender && missingRecipient
        ? '"Your Name" and "Their Name"'
        : missingSender
          ? '"Your Name"'
          : '"Their Name"'

      toast({
        title: `Please fill in ${missing}`,
        description: missingSender && missingRecipient
          ? "Both names are needed to create a personalized AI message. Scroll up and fill them in!"
          : missingSender
            ? "Your name is needed so the AI can personalize the message. Scroll up and fill it in!"
            : "Your loved one's name is needed to generate a personalized message. Scroll up and fill it in!",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsGeneratingMessage(true)
    try {
      // Generate unique, funny and loving messages with varied tone
      const messages = [
        `Every moment with you makes my heart skip a beat. You are my love, my light, and my everything. But mostly, you're my favorite person to annoy. Happy Valentine's Day, ${recipientName}. 💕`,
        `In a world full of chaos, you are my calm. Thank you for being the reason I smile (even when you steal my fries). I love you endlessly, ${recipientName}. 🌹`,
        `My heart knew you before my mind caught up. You're not just my love; you're my forever. Also, you're stuck with me now. Happy Valentine's Day, my special one. 💖`,
        `${recipientName}, you're the melody in my heart and the warmth in my soul. With you, every day feels like Valentine's Day. Even the days you look like a zombie before coffee. 💝`,
        `If love is a journey, then with you, ${recipientName}, I've found my destination. Plus, I'm pretty sure you're sorcery because you make everything better. Forever yours. 🌹💕`,
        `Your smile brightens my darkest days. Your laugh makes me the happiest guy/girl alive. And somehow, you make my terrible jokes seem funny. Happy Valentine's Day to the one I love most, ${recipientName}. 💗`,
        `Every love song ever written is about us. Thank you for making my dreams come true, ${recipientName}. Even the weird ones. I adore you. 💕`,
        `You make my heart believe in forever. With you by my side, I can conquer anything. Even that one thing we don't talk about. Happy Valentine's Day, ${recipientName}. 💖`,
        `Love is not something I believed in until I met you, ${recipientName}. You are my greatest blessing. And my favorite distraction from work. 🌹`,
        `${recipientName}, you are my home, my safe place, and my greatest love. Thank you for being YOU. Weird, wonderful, and all mine. Forever grateful. 💕`,
        `You're my favorite hello and my hardest goodbye. But mostly my favorite "I can't believe you did that" laugh. I love you more than pizza, ${recipientName}. And that's saying something. 🍕💕`,
        `My heart is yours, now and forever. Even when you hog the blankets. Even when you sing off-key. Even when you're being absolutely ridiculous. That's the real love right here, ${recipientName}. 💖`,
      ]
      
      // Use seeded random based on names to ensure uniqueness
      const seed = (senderName + recipientName).split('').reduce((a: number, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      
      const index = Math.abs(seed) % messages.length
      const selectedMessage = messages[index]
      
      // Set message and immediately show the display modal
      setMessage(selectedMessage)
      setShowAIMessageDisplay(true)

      toast({
        title: "AI Love Message Generated!",
        description: "Check out your unique message",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate message. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Show local preview immediately
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Vercel Blob for full-quality sharing
      setIsUploadingPhoto(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/valentine/upload-photo', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.url) {
          setUploadedBlobUrl(data.url)
          toast({
            title: "Photo uploaded!",
            description: "Your photo has been added in full quality",
          })
        } else {
          toast({
            title: "Upload issue",
            description: data.error || "Photo saved locally but may not appear in shared link",
            variant: "destructive",
          })
        }
      } catch {
        toast({
          title: "Upload issue",
          description: "Photo saved locally but may not appear in shared link",
          variant: "destructive",
        })
      } finally {
        setIsUploadingPhoto(false)
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Love message link copied to clipboard",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/20 via-hacker-terminal to-purple-900/20 relative overflow-hidden pt-24 pb-16">
      {/* Floating Flowers */}
      <FloatingFlowers />
      
      {/* Animated background hearts */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 0,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-2xl relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block mb-4"
          >
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-tech font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            Share The Love
          </h1>
          <p className="text-rose-200/70 font-tech text-lg">
            Create a special Valentine message for your loved one
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-hacker-terminal/40 backdrop-blur-xl border-2 border-rose-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-rose-500/20"
        >
          {/* Form Section */}
          {!shareLink ? (
            <div className="space-y-6">
              {/* Sender Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-tech font-bold text-rose-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-hacker-terminal border-2 border-rose-500/30 rounded-lg text-rose-100 placeholder-rose-400/50 focus:border-rose-500 focus:outline-none transition-all font-tech"
                />
              </motion.div>

              {/* Recipient Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-tech font-bold text-rose-300 mb-2">
                  Their Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full px-4 py-3 bg-hacker-terminal border-2 border-rose-500/30 rounded-lg text-rose-100 placeholder-rose-400/50 focus:border-rose-500 focus:outline-none transition-all font-tech"
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-tech font-bold text-rose-300">
                    Your Message
                  </label>
                  <button
                    onClick={() => setUseAI(!useAI)}
                    className={`text-xs font-tech px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      useAI
                        ? "bg-rose-500/30 text-rose-300 border border-rose-500"
                        : "bg-rose-500/10 text-rose-400/60 border border-rose-500/20"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    AI Mode
                  </button>
                </div>

                {useAI ? (
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateAIMessage}
                      disabled={isGeneratingMessage}
                      className="w-full px-4 py-3 bg-gradient-to-r from-rose-500/30 to-pink-500/30 border-2 border-rose-500/50 rounded-lg text-rose-300 hover:text-rose-200 font-tech font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingMessage ? "Generating..." : "Generate AI Love Message"}
                    </motion.button>
                    <p className="text-xs text-rose-400/60 font-tech">
                      Each message is unique based on your names. Generate as many as you like!
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      // Show alert when reaching limit
                      if (e.target.value.length >= MAX_CHARACTERS && message.length < MAX_CHARACTERS) {
                        toast({
                          title: "Character Limit Reached",
                          description: "You've reached the 600 character limit. Add a validation token to continue writing.",
                          variant: "destructive",
                        })
                      }
                    }}
                    placeholder="Write your love message here... (max 600 characters)"
                    maxLength={tokenValidated ? validatedCharacters : MAX_CHARACTERS}
                    rows={6}
                    className="w-full px-4 py-3 bg-hacker-terminal border-2 border-rose-500/30 rounded-lg text-rose-100 placeholder-rose-400/50 focus:border-rose-500 focus:outline-none transition-all font-tech resize-none"
                  />
                )}

                {message && (
                  <motion.div 
                    className="mt-2 flex items-center justify-between"
                    animate={message.length >= (tokenValidated ? validatedCharacters : WARNING_THRESHOLD) ? { scale: 1.05 } : { scale: 1 }}
                  >
                    <div className={`text-xs font-tech transition-colors ${
                      message.length >= (tokenValidated ? validatedCharacters : WARNING_THRESHOLD) ? 'text-rose-500 font-bold' : 'text-rose-400/60'
                    }`}>
                      {message.length}/{tokenValidated ? validatedCharacters : MAX_CHARACTERS} characters
                    </div>
                    {message.length >= (tokenValidated ? validatedCharacters : WARNING_THRESHOLD) && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs text-rose-500 font-tech flex items-center gap-1 bg-rose-500/20 px-2 py-1 rounded border border-rose-500/50"
                      >
                        <Sparkles className="w-3 h-3 animate-spin" />
                        {tokenValidated ? "Limit reached! Generate or Share" : "Limit reached! Add token to continue"}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Token Validation (if message exceeds limit) */}
              {message.length >= WARNING_THRESHOLD && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  variants={itemVariants}
                  className="bg-rose-500/10 border-2 border-rose-500/30 rounded-lg p-4"
                >
                  <label className="block text-sm font-tech font-bold text-rose-300 mb-3">
                    Message Over 600 Characters?
                  </label>
                  <div className="space-y-4">
                    {/* Pricing Table */}
                    <div className="bg-hacker-terminal/50 rounded-lg overflow-hidden border border-rose-500/20">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
                        {tokenPricing.map((tier, idx) => (
                          <div key={idx} className="text-center text-xs sm:text-sm font-tech border-r border-rose-500/20 last:border-r-0 py-2">
                            <div className="text-rose-400 font-bold">{tier.amount}</div>
                            <div className="text-rose-300">{tier.characters} chars</div>
                            <div className="text-rose-400/50 text-xs mt-1">{tier.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Token Input */}
                    <div className="space-y-2">
                      <p className="text-xs text-rose-300 font-tech">
                        Enter your token to increase character limit
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={validationToken}
                          onChange={(e) => setValidationToken(e.target.value.toUpperCase())}
                          placeholder="Enter token"
                          className="flex-1 px-4 py-2 bg-hacker-terminal border-2 border-rose-500/30 rounded-lg text-rose-100 placeholder-rose-400/50 focus:border-rose-500 focus:outline-none transition-all font-tech"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => validateToken(validationToken)}
                          disabled={isGeneratingMessage}
                          className="px-4 py-2 bg-rose-500 text-white font-tech font-bold rounded-lg hover:bg-rose-600 transition-all disabled:opacity-50"
                        >
                          Verify
                        </motion.button>
                      </div>
                      {tokenValidated && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-500/20 border border-green-500/50 rounded p-2"
                        >
                          <p className="text-xs text-green-300 font-tech">
                            ✓ Token verified! You can write up to {validatedCharacters} characters
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <a
                      href="https://anonymiketech-payments.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-rose-500/30 to-pink-500/30 border border-rose-500/50 rounded-lg text-rose-300 hover:text-rose-200 font-tech text-sm transition-all"
                    >
                      Pay to Support & Get Token
                    </a>
                  </div>
                </motion.div>
              )}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-tech font-bold text-rose-300 mb-2">
                  Add a Photo (Optional)
                </label>
                {!uploadedImage ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="block w-full px-4 py-6 border-2 border-dashed border-rose-500/30 rounded-lg cursor-pointer hover:border-rose-500 transition-all text-center"
                    >
                      <Upload className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                      <p className="text-rose-300 font-tech text-sm">
                        Click to upload a photo
                      </p>
                      <p className="text-rose-400/50 font-tech text-xs mt-1">
                        JPG, PNG supported (max 5MB). Full quality preserved.
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block w-full">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-lg overflow-hidden border-2 border-rose-500/30 max-w-sm mx-auto"
                    >
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-rose-300 font-tech text-xs">Uploading...</p>
                          </div>
                        </div>
                      )}
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="w-full h-auto max-h-64 sm:max-h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 to-transparent pointer-events-none" />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setUploadedImage(null); setUploadedBlobUrl(null) }}
                      className="absolute top-2 right-2 p-2 bg-rose-500/80 hover:bg-rose-600 rounded-full text-white shadow-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Create Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: (isGeneratingLink || isUploadingPhoto) ? 1 : 1.05, boxShadow: (isGeneratingLink || isUploadingPhoto) ? "none" : "0 0 30px rgba(244, 63, 94, 0.5)" }}
                whileTap={{ scale: (isGeneratingLink || isUploadingPhoto) ? 1 : 0.95 }}
                onClick={generateShareLink}
                disabled={isGeneratingLink || isUploadingPhoto}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-tech font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Heart className="w-5 h-5" />
                {isUploadingPhoto ? "Uploading photo..." : isGeneratingLink ? "Preparing your message..." : "Create Love Message"}
                {!isGeneratingLink && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          ) : (
            /* Share Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-center mb-6"
              >
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto" />
              </motion.div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-tech font-bold text-rose-300 mb-2">
                  Perfect! Love Loaded ♥
                </h2>
                <p className="text-rose-200/70 font-tech">
                  Your message is ready to share. Copy the link and send it to your special someone!
                </p>
              </div>

              {/* Share Link Box */}
              <div className="bg-hacker-terminal/60 border-2 border-rose-500/50 rounded-lg p-4 flex items-center gap-3">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-rose-100 font-tech text-sm overflow-x-auto no-scrollbar"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-all ${
                    copied
                      ? "bg-green-500/30 text-green-400"
                      : "bg-rose-500/30 text-rose-400 hover:bg-rose-500/50"
                  }`}
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.share?.({
                      title: "Valentine's Love Message",
                      text: `Check out this special Valentine message from ${senderName}!`,
                      url: shareLink,
                    })
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-tech font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Message
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShareLink("")
                    setRecipientName("")
                    setMessage("")
                    setSenderName("")
                  }}
                  className="w-full bg-hacker-terminal border-2 border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-rose-200 font-tech font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Create Another Message
                </motion.button>
              </div>

              {/* Preview Link */}
              <div className="text-center">
                <p className="text-rose-200/70 font-tech text-sm mb-3">
                  Want to see how it looks?
                </p>
                <Link
                  href={shareLink}
                  target="_blank"
                  className="inline-block text-rose-400 hover:text-rose-300 font-tech underline"
                >
                  Preview Message
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Info Cards */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {[
            { title: "Easy to Share", desc: "Generate a unique link instantly" },
            { title: "Animated Magic", desc: "Recipient sees a special animated message" },
            { title: "AI Powered", desc: "Generate unique love messages with AI" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-hacker-terminal/30 border border-rose-500/20 rounded-xl p-6 text-center hover:border-rose-500/50 transition-all"
            >
              {idx === 2 ? (
                <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              ) : (
                <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              )}
              <h3 className="font-tech font-bold text-rose-300 mb-2">{item.title}</h3>
              <p className="text-rose-200/60 text-sm font-tech">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* AI Message Display Modal */}
      <AIMessageDisplay
        message={message}
        recipientName={recipientName}
        isVisible={showAIMessageDisplay}
        onClose={() => setShowAIMessageDisplay(false)}
      />
    </div>
  )
}
