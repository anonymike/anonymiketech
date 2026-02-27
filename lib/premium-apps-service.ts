// Service for managing premium apps data using localStorage
import { PremiumApp } from './premium-apps-data'

const PREMIUM_APPS_STORAGE_KEY = 'premiumAppsData'
const DEFAULT_PREMIUM_APPS: PremiumApp[] = [
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
    isNew: true,
    isOffer: false,
    offerPrice: undefined,
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
    isNew: false,
    isOffer: true,
    offerPrice: 80,
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
    isNew: false,
    isOffer: false,
    offerPrice: undefined,
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
    isNew: false,
    isOffer: false,
    offerPrice: undefined,
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
    isNew: true,
    isOffer: false,
    offerPrice: undefined,
  },
  {
    id: "secure-vault",
    name: "Secure Vault Premium",
    description: "Military-grade encryption for your files with secure cloud backup",
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
    isNew: false,
    isOffer: false,
    offerPrice: undefined,
  },
]

// Initialize localStorage if not already done
function initializeStorage() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(PREMIUM_APPS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(PREMIUM_APPS_STORAGE_KEY, JSON.stringify(DEFAULT_PREMIUM_APPS))
  }
}

// Get all premium apps
export function getPremiumApps(): PremiumApp[] {
  if (typeof window === 'undefined') return DEFAULT_PREMIUM_APPS
  initializeStorage()
  const stored = localStorage.getItem(PREMIUM_APPS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_PREMIUM_APPS
}

// Get a single premium app by ID
export function getPremiumApp(id: string): PremiumApp | undefined {
  const apps = getPremiumApps()
  return apps.find(app => app.id === id)
}

// Create a new premium app
export function createPremiumApp(app: Omit<PremiumApp, 'id'>): PremiumApp {
  const apps = getPremiumApps()
  const newApp: PremiumApp = {
    ...app,
    id: app.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
  }
  apps.push(newApp)
  if (typeof window !== 'undefined') {
    localStorage.setItem(PREMIUM_APPS_STORAGE_KEY, JSON.stringify(apps))
  }
  return newApp
}

// Update a premium app
export function updatePremiumApp(id: string, updates: Partial<PremiumApp>): PremiumApp | undefined {
  const apps = getPremiumApps()
  const index = apps.findIndex(app => app.id === id)
  if (index === -1) return undefined
  
  apps[index] = { ...apps[index], ...updates, id: apps[index].id }
  if (typeof window !== 'undefined') {
    localStorage.setItem(PREMIUM_APPS_STORAGE_KEY, JSON.stringify(apps))
  }
  return apps[index]
}

// Delete a premium app
export function deletePremiumApp(id: string): boolean {
  const apps = getPremiumApps()
  const index = apps.findIndex(app => app.id === id)
  if (index === -1) return false
  
  apps.splice(index, 1)
  if (typeof window !== 'undefined') {
    localStorage.setItem(PREMIUM_APPS_STORAGE_KEY, JSON.stringify(apps))
  }
  return true
}
