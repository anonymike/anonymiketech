export interface InstallationStep {
  step: number
  title: string
  description: string
  details?: string
}

export interface SystemRequirement {
  name: string
  value: string
}

export interface VersionEntry {
  version: string
  date: string
  changes: string[]
  size: string
}

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
  isNew?: boolean
  isOffer?: boolean
  offerPrice?: number
  installation_instructions?: InstallationStep[]
  system_requirements?: SystemRequirement[]
  version_history?: VersionEntry[]
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
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download the Telegram Premium Mod APK file",
        details: "Ensure you have at least 150 MB of free storage space.",
      },
      {
        step: 2,
        title: "Enable Unknown Sources",
        description: "Go to Settings > Security > Enable Unknown Sources",
        details: "This allows installation from sources other than Play Store.",
      },
      {
        step: 3,
        title: "Install APK",
        description: "Locate and open the downloaded APK file",
        details: "Tap Install and wait for the process to complete.",
      },
      {
        step: 4,
        title: "Launch & Verify",
        description: "Open Telegram and verify premium features are active",
        details: "All your existing chats and contacts will be automatically imported.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "150 MB free space" },
      { name: "Internet", value: "2G/3G/4G/WiFi" },
    ],
    version_history: [
      {
        version: "v124.1",
        date: "April 13, 2026",
        changes: ["Enhanced message encryption", "Improved sticker performance", "UI refinements"],
        size: "52.3 MB",
      },
      {
        version: "v124.0",
        date: "April 10, 2026",
        changes: ["Performance improvements"],
        size: "52.1 MB",
      },
    ],
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
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download the Spotify Premium Mod APK",
        details: "File size: ~100 MB. Download on WiFi for better speed.",
      },
      {
        step: 2,
        title: "Enable Unknown Sources",
        description: "Navigate to Settings and enable unknown sources",
        details: "This permission is required for non-Play Store app installation.",
      },
      {
        step: 3,
        title: "Install Application",
        description: "Open the APK and tap the Install button",
        details: "Installation completes in about 2-3 minutes.",
      },
      {
        step: 4,
        title: "Sign In & Enjoy",
        description: "Open Spotify and sign in with your account",
        details: "All premium features will be immediately unlocked.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Internet Speed", value: "2G minimum, 4G recommended" },
    ],
    version_history: [
      {
        version: "v9.122.1630",
        date: "April 12, 2026",
        changes: ["Improved audio quality options", "Enhanced offline mode", "Bug fixes"],
        size: "98.4 MB",
      },
      {
        version: "v9.122.1620",
        date: "April 5, 2026",
        changes: ["Library improvements", "UI optimizations"],
        size: "98.1 MB",
      },
    ],
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
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download Truecaller Premium Mod APK file",
        details: "File size: ~90 MB. Ensure sufficient storage space available.",
      },
      {
        step: 2,
        title: "Enable Installation",
        description: "Allow installation from unknown sources in Settings",
        details: "Settings > Apps > Special access > Install unknown apps.",
      },
      {
        step: 3,
        title: "Install the APK",
        description: "Open the downloaded APK and select Install",
        details: "Installation takes approximately 1-2 minutes.",
      },
      {
        step: 4,
        title: "Grant Permissions",
        description: "Allow all necessary permissions for full functionality",
        details: "Phone, contacts, and SMS permissions are required.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "6.0 and above" },
      { name: "RAM", value: "2.5 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Internet", value: "Active data connection" },
    ],
    version_history: [
      {
        version: "v25.5.7",
        date: "April 11, 2026",
        changes: ["Improved caller detection", "Enhanced spam filtering", "Fixed permission issues"],
        size: "92.3 MB",
      },
      {
        version: "v25.5.5",
        date: "April 3, 2026",
        changes: ["Database optimization", "Performance boost"],
        size: "92.0 MB",
      },
    ],
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
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    description: "Stream movies, series, and documentaries in HD and 4K",
    longDescription: "Netflix Premium subscription gives you access to unlimited movies, TV shows, and documentaries in stunning 4K Ultra HD quality. Watch on multiple devices simultaneously with no ads.",
    features: [
      "4K Ultra HD streaming",
      "Watch on 4 devices simultaneously",
      "Offline downloads",
      "Ad-free experience",
      "Exclusive content",
      "Personalized recommendations",
    ],
    price: 200,
    category: "Entertainment",
    icon: "🎬",
    image: "/images/netflix-premium.jpg",
    downloads: 125400,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    description: "Ad-free videos, background play, and offline downloads",
    longDescription: "YouTube Premium removes ads and lets you play videos in the background. Download videos to watch offline and enjoy uninterrupted entertainment across all your devices.",
    features: [
      "Ad-free viewing",
      "Background play",
      "Offline downloads",
      "YouTube Music included",
      "YouTube Original content",
      "Early access to new features",
    ],
    price: 150,
    category: "Entertainment",
    icon: "▶️",
    image: "/images/youtube-premium.jpg",
    downloads: 98650,
  },
  {
    id: "showmax-premium",
    name: "Showmax Premium",
    description: "African entertainment streaming with movies and series",
    longDescription: "Showmax Premium provides access to the largest selection of African movies and series, plus international content. Enjoy 4K streaming and offline downloads with seamless multi-device support.",
    features: [
      "African content library",
      "4K streaming quality",
      "Offline downloads",
      "Multiple profiles",
      "No ads",
      "Monthly movie releases",
    ],
    price: 250,
    category: "Entertainment",
    icon: "🌍",
    image: "/images/showmax-premium.jpg",
    downloads: 76320,
  },
  {
    id: "animations-premium",
    name: "Animations Premium",
    description: "Unlimited anime and animation streaming",
    longDescription: "Animations Premium offers the largest library of anime, manga, and animation content. Access exclusive series, movies, and original productions with high-quality streaming.",
    features: [
      "Unlimited anime library",
      "HD and 4K streaming",
      "Manga reader included",
      "Offline downloads",
      "Exclusive originals",
      "No ads",
    ],
    price: 450,
    category: "Entertainment",
    icon: "🎨",
    image: "/images/animations-premium.jpg",
    downloads: 54890,
  },
  {
    id: "peacock-premium",
    name: "Peacock Premium",
    description: "NBC content, movies, and exclusive streaming shows",
    longDescription: "Peacock Premium gives you access to NBC content, live sports, movies, and exclusive Peacock original series. Stream your favorite shows anytime with premium quality.",
    features: [
      "NBC content library",
      "Live sports coverage",
      "Exclusive originals",
      "Next-day TV episodes",
      "4K streaming",
      "No ads",
    ],
    price: 350,
    category: "Entertainment",
    icon: "🦚",
    image: "/images/peacock-premium.jpg",
    downloads: 43210,
  },
  {
    id: "telegram-latest-v2.6.4",
    name: "Telegram Latest v2.6.4 Premium Mod",
    description: "Latest v2.6.4 Premium Mod - 58.2 MB APK",
    longDescription: "Telegram Premium Mod with all features unlocked. Enhanced messaging, premium stickers, advanced privacy controls, and seamless file sharing.",
    features: [
      "All premium features unlocked",
      "Premium stickers & reactions",
      "Advanced customization",
      "Enhanced security features",
      "Cloud storage optimization",
      "Priority support",
    ],
    price: 0,
    category: "Messaging",
    icon: "💬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 125670,
    isNew: true,
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download the Telegram v2.6.4 Premium Mod APK file",
        details: "File size: 58.2 MB. Ensure you have enough storage space on your device.",
      },
      {
        step: 2,
        title: "Enable Unknown Sources",
        description: "Go to Settings > Security > Enable Unknown Sources",
        details: "This allows installation of apps from sources other than Google Play Store.",
      },
      {
        step: 3,
        title: "Install APK",
        description: "Open the APK file and tap Install",
        details: "The installation process may take 1-2 minutes depending on your device speed.",
      },
      {
        step: 4,
        title: "Launch Application",
        description: "Open Telegram and sign in with your account",
        details: "All your chats and contacts will sync automatically.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Screen Size", value: "4.5 inches and above" },
    ],
    version_history: [
      {
        version: "2.6.4",
        date: "April 13, 2026",
        changes: ["Fixed message notifications", "Improved video streaming", "Enhanced security patches"],
        size: "58.2 MB",
      },
      {
        version: "2.6.3",
        date: "April 10, 2026",
        changes: ["Bug fixes", "Performance improvements"],
        size: "58.0 MB",
      },
    ],
  },
  {
    id: "truecaller-latest-v26.13.7",
    name: "Truecaller Latest v26.13.7 Premium",
    description: "Latest v26.13.7 Premium Mod - 105.1 MB APK",
    longDescription: "Advanced caller ID and spam detection with call recording, number lookup, and premium blocking features. Identify and block unwanted calls instantly.",
    features: [
      "Advanced caller identification",
      "Spam call blocking",
      "Call recording",
      "Caller search database",
      "Premium number lookup",
      "Blacklist management",
    ],
    price: 0,
    category: "Communication",
    icon: "☎️",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 98540,
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download the Truecaller v26.13.7 Premium APK",
        details: "File size: 105.1 MB. Make sure you have at least 200 MB of free storage.",
      },
      {
        step: 2,
        title: "Allow Unknown Sources",
        description: "Enable installation from unknown sources in Settings",
        details: "Navigate to Settings > Apps > Special app access > Install unknown apps.",
      },
      {
        step: 3,
        title: "Install the APK",
        description: "Tap on the downloaded APK and select Install",
        details: "Wait for the installation to complete. This may take a few minutes.",
      },
      {
        step: 4,
        title: "Grant Permissions",
        description: "Allow all required permissions for full functionality",
        details: "Truecaller needs access to contacts, phone, and SMS for proper operation.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "6.0 and above" },
      { name: "RAM", value: "3 GB minimum" },
      { name: "Storage", value: "300 MB free space" },
      { name: "Internet", value: "4G/WiFi required" },
    ],
    version_history: [
      {
        version: "26.13.7",
        date: "April 13, 2026",
        changes: ["Improved caller ID accuracy", "Enhanced spam detection", "Fixed permission issues"],
        size: "105.1 MB",
      },
      {
        version: "26.13.5",
        date: "April 8, 2026",
        changes: ["Database updates", "UI improvements"],
        size: "104.8 MB",
      },
    ],
  },
  {
    id: "yt-music-latest-v9.13.51",
    name: "YT Music Latest v9.13.51 Premium",
    description: "Latest v9.13.51 Premium Mod - 105.8 MB APK",
    longDescription: "YouTube Music Premium with unlimited streaming, offline downloads, ad-free listening, and high-quality audio. Access millions of songs and personalized playlists.",
    features: [
      "Ad-free music streaming",
      "Offline downloads",
      "High-quality audio",
      "Unlimited skips",
      "Personalized playlists",
      "Background play",
    ],
    price: 0,
    category: "Entertainment",
    icon: "🎵",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 154320,
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Get the YT Music v9.13.51 Premium APK file",
        details: "File size: 105.8 MB. Requires stable internet connection for download.",
      },
      {
        step: 2,
        title: "Enable Installation",
        description: "Allow installation from unknown sources",
        details: "Settings > Apps > Permission Manager > Allow installation of apps.",
      },
      {
        step: 3,
        title: "Install APK",
        description: "Open the APK and tap Install button",
        details: "Installation takes approximately 2-3 minutes based on device speed.",
      },
      {
        step: 4,
        title: "Sign In",
        description: "Use your Google account to sign in",
        details: "Your music library and playlists will sync automatically.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "7.0 and above" },
      { name: "RAM", value: "2.5 GB minimum" },
      { name: "Storage", value: "250 MB free space" },
      { name: "Internet", value: "WiFi or 4G LTE" },
    ],
    version_history: [
      {
        version: "9.13.51",
        date: "April 13, 2026",
        changes: ["Improved streaming quality", "Fixed audio codec issues", "Enhanced UI responsiveness"],
        size: "105.8 MB",
      },
      {
        version: "9.13.48",
        date: "April 5, 2026",
        changes: ["Playlist sync improvements", "Bug fixes"],
        size: "105.5 MB",
      },
    ],
  },
  {
    id: "flix-vision-v3.6.1r",
    name: "FLIX VISION Latest v3.6.1r Premium",
    description: "Latest v3.6.1r Premium Mod - 41.7 MB APK",
    longDescription: "Premium streaming service with extensive movie and TV show library. Enjoy 4K content, offline downloads, and seamless multi-device streaming experience.",
    features: [
      "4K streaming quality",
      "Offline downloads",
      "Multiple simultaneous streams",
      "Ad-free experience",
      "Premium content library",
      "Personalized recommendations",
    ],
    price: 0,
    category: "Entertainment",
    icon: "🎬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 76540,
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download FLIX VISION v3.6.1r APK",
        details: "File size: 41.7 MB. Requires good internet connection for streaming.",
      },
      {
        step: 2,
        title: "Allow Unknown Sources",
        description: "Enable app installation from unknown sources",
        details: "Go to Settings > Security > Unknown Sources.",
      },
      {
        step: 3,
        title: "Install",
        description: "Tap the APK file and select Install",
        details: "Installation completes in about 1-2 minutes.",
      },
      {
        step: 4,
        title: "Start Streaming",
        description: "Open the app and enjoy premium content",
        details: "Login with your credentials to access all premium features.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "6.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "150 MB free space" },
      { name: "Internet Speed", value: "10 Mbps for 4K streaming" },
    ],
    version_history: [
      {
        version: "3.6.1r",
        date: "April 13, 2026",
        changes: ["4K streaming support", "Fixed playback issues", "Improved UI responsiveness"],
        size: "41.7 MB",
      },
      {
        version: "3.6.0",
        date: "April 1, 2026",
        changes: ["Library expansion", "Performance optimization"],
        size: "41.5 MB",
      },
    ],
  },
  {
    id: "moviebox-latest-v3.0.13",
    name: "MovieBox Latest v3.0.13.0317.03",
    description: "Premium streaming platform with movies and series",
    longDescription: "MovieBox Premium offers unlimited access to movies, TV series, and exclusive content. Stream in HD quality with offline download capability and fast streaming.",
    features: [
      "Movies and TV series library",
      "HD streaming quality",
      "Offline downloads",
      "Fast streaming",
      "No buffering",
      "Multiple subtitle options",
    ],
    price: 0,
    category: "Entertainment",
    icon: "🎥",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 89760,
    installation_instructions: [
      {
        step: 1,
        title: "Download APK",
        description: "Download MovieBox v3.0.13 APK file",
        details: "File size: 79.5 MB. Download on WiFi for faster installation.",
      },
      {
        step: 2,
        title: "Enable Unknown Sources",
        description: "Allow installation from unknown sources",
        details: "Settings > Applications > Unknown sources > Enable.",
      },
      {
        step: 3,
        title: "Install APK",
        description: "Open the APK file and tap Install",
        details: "Wait for installation to complete completely.",
      },
      {
        step: 4,
        title: "Start Watching",
        description: "Launch MovieBox and explore the content library",
        details: "All premium features are unlocked for immediate use.",
      },
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Internet", value: "4G/WiFi required" },
    ],
    version_history: [
      {
        version: "3.0.13.0317.03",
        date: "April 13, 2026",
        changes: ["Enhanced streaming performance", "UI improvements", "Bug fixes"],
        size: "79.5 MB",
      },
      {
        version: "3.0.12",
        date: "March 30, 2026",
        changes: ["Library update", "Performance optimization"],
        size: "79.2 MB",
      },
    ],
  },
]
