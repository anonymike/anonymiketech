export interface PremiumApp {
  id: string
  name: string
  description: string
  longDescription: string
  features: string[]
  price: number
  category: string
  icon: string
  image: string
  downloads: number
}

export const premiumApps: PremiumApp[] = [
  {
    id: "telegram-premium",
    name: "Telegram Premium Mod",
    description: "Latest v124.1 Premium Mod - Enhanced messaging features",
    longDescription: "Premium version of Telegram with all exclusive features unlocked. Enhanced security, premium stickers, advanced customization, and priority support.",
    features: [
      "All premium features unlocked",
      "Advanced customization",
      "Premium stickers & reactions",
      "Enhanced privacy settings",
      "Priority support",
      "Cloud storage optimization",
    ],
    price: 100,
    category: "Messaging",
    icon: "💬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 45230,
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium Mod",
    description: "Latest v9.122.1630 Premium Mod - Music streaming at its best",
    longDescription: "Premium music streaming with no ads, offline downloads, highest audio quality, and unlimited skips. Access millions of songs without interruptions.",
    features: [
      "Ad-free listening",
      "Offline downloads",
      "Highest audio quality",
      "Unlimited skips",
      "Exclusive content",
      "Cross-platform sync",
    ],
    price: 100,
    category: "Entertainment",
    icon: "🎵",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 67890,
  },
  {
    id: "red-flash-pro",
    name: "Red Flash Pro Mix",
    description: "Professional mixing and audio production suite",
    longDescription: "Advanced audio mixing and production tool with professional-grade effects, real-time processing, and studio-quality output for content creators.",
    features: [
      "Professional effects suite",
      "Real-time audio processing",
      "Multi-track mixing",
      "Studio-quality output",
      "Advanced EQ controls",
      "Custom presets",
    ],
    price: 100,
    category: "Audio",
    icon: "🎚️",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 23450,
  },
  {
    id: "truecaller-premium",
    name: "Truecaller Premium Mod",
    description: "Latest v25.5.7 Premium Mod - Advanced caller ID",
    longDescription: "Premium caller ID and spam detection with advanced blocking, call recording, and caller search. Identify and block unwanted calls instantly.",
    features: [
      "Advanced caller identification",
      "Spam call blocking",
      "Call recording",
      "Caller search database",
      "Number lookup",
      "Premium filters",
    ],
    price: 100,
    category: "Communication",
    icon: "☎️",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 54120,
  },
  {
    id: "flix-vision",
    name: "Flix Vision Premium Mod",
    description: "Premium streaming with unlimited content library",
    longDescription: "Premium video streaming platform with 4K content, offline downloads, simultaneous streams, and exclusive shows. Watch anywhere, anytime.",
    features: [
      "4K streaming",
      "Offline downloads",
      "Multiple simultaneous streams",
      "Exclusive content",
      "Ad-free experience",
      "Personalized recommendations",
    ],
    price: 100,
    category: "Entertainment",
    icon: "🎬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 78920,
  },
  {
    id: "secure-vault",
    name: "Secure Vault Premium",
    description: "Advanced file encryption and cloud backup",
    longDescription: "Military-grade encryption for your files with secure cloud backup, biometric access, and cross-device synchronization for maximum security.",
    features: [
      "Military-grade encryption",
      "Cloud backup",
      "Biometric access",
      "Cross-device sync",
      "Zero-knowledge storage",
      "Auto-backup scheduling",
    ],
    price: 100,
    category: "Security",
    icon: "🔒",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mfLsinYOBm5lJpXmpKXjdRnTWlkblw.png",
    downloads: 34567,
  },
]
