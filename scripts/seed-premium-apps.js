import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const premiumAppsData = [
  {
    id: "telegram-latest-v2.6.4",
    name: "Telegram Latest v2.6.4 Premium Mod",
    description: "Latest v2.6.4 Premium Mod - 58.2 MB APK",
    long_description: "Telegram Premium Mod with all features unlocked. Enhanced messaging, premium stickers, advanced privacy controls, and seamless file sharing.",
    features: ["All premium features unlocked", "Premium stickers & reactions", "Advanced customization", "Enhanced security features", "Cloud storage optimization", "Priority support"],
    price: 0,
    category: "Messaging",
    icon: "💬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 125670,
    is_new: true,
    installation_instructions: [
      { step: 1, title: "Download APK", description: "Download the Telegram v2.6.4 Premium Mod APK file", details: "File size: 58.2 MB. Ensure you have enough storage space on your device." },
      { step: 2, title: "Enable Unknown Sources", description: "Go to Settings > Security > Enable Unknown Sources", details: "This allows installation of apps from sources other than Google Play Store." },
      { step: 3, title: "Install APK", description: "Open the APK file and tap Install", details: "The installation process may take 1-2 minutes depending on your device speed." },
      { step: 4, title: "Launch Application", description: "Open Telegram and sign in with your account", details: "All your chats and contacts will sync automatically." }
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Screen Size", value: "4.5 inches and above" }
    ],
    version_history: [
      { version: "2.6.4", date: "April 13, 2026", changes: ["Fixed message notifications", "Improved video streaming", "Enhanced security patches"], size: "58.2 MB" },
      { version: "2.6.3", date: "April 10, 2026", changes: ["Bug fixes", "Performance improvements"], size: "58.0 MB" }
    ]
  },
  {
    id: "truecaller-latest-v26.13.7",
    name: "Truecaller Latest v26.13.7 Premium",
    description: "Latest v26.13.7 Premium Mod - 105.1 MB APK",
    long_description: "Advanced caller ID and spam detection with call recording, number lookup, and premium blocking features. Identify and block unwanted calls instantly.",
    features: ["Advanced caller identification", "Spam call blocking", "Call recording", "Caller search database", "Premium number lookup", "Blacklist management"],
    price: 0,
    category: "Communication",
    icon: "☎️",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 98540,
    installation_instructions: [
      { step: 1, title: "Download APK", description: "Download the Truecaller v26.13.7 Premium APK", details: "File size: 105.1 MB. Make sure you have at least 200 MB of free storage." },
      { step: 2, title: "Allow Unknown Sources", description: "Enable installation from unknown sources in Settings", details: "Navigate to Settings > Apps > Special app access > Install unknown apps." },
      { step: 3, title: "Install the APK", description: "Tap on the downloaded APK and select Install", details: "Wait for the installation to complete. This may take a few minutes." },
      { step: 4, title: "Grant Permissions", description: "Allow all required permissions for full functionality", details: "Truecaller needs access to contacts, phone, and SMS for proper operation." }
    ],
    system_requirements: [
      { name: "Android Version", value: "6.0 and above" },
      { name: "RAM", value: "3 GB minimum" },
      { name: "Storage", value: "300 MB free space" },
      { name: "Internet", value: "4G/WiFi required" }
    ],
    version_history: [
      { version: "26.13.7", date: "April 13, 2026", changes: ["Improved caller ID accuracy", "Enhanced spam detection", "Fixed permission issues"], size: "105.1 MB" },
      { version: "26.13.5", date: "April 8, 2026", changes: ["Database updates", "UI improvements"], size: "104.8 MB" }
    ]
  },
  {
    id: "yt-music-latest-v9.13.51",
    name: "YT Music Latest v9.13.51 Premium",
    description: "Latest v9.13.51 Premium Mod - 105.8 MB APK",
    long_description: "YouTube Music Premium with unlimited streaming, offline downloads, ad-free listening, and high-quality audio. Access millions of songs and personalized playlists.",
    features: ["Ad-free music streaming", "Offline downloads", "High-quality audio", "Unlimited skips", "Personalized playlists", "Background play"],
    price: 0,
    category: "Entertainment",
    icon: "🎵",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 154320,
    installation_instructions: [
      { step: 1, title: "Download APK", description: "Get the YT Music v9.13.51 Premium APK file", details: "File size: 105.8 MB. Requires stable internet connection for download." },
      { step: 2, title: "Enable Installation", description: "Allow installation from unknown sources", details: "Settings > Apps > Permission Manager > Allow installation of apps." },
      { step: 3, title: "Install APK", description: "Open the APK and tap Install button", details: "Installation takes approximately 2-3 minutes based on device speed." },
      { step: 4, title: "Sign In", description: "Use your Google account to sign in", details: "Your music library and playlists will sync automatically." }
    ],
    system_requirements: [
      { name: "Android Version", value: "7.0 and above" },
      { name: "RAM", value: "2.5 GB minimum" },
      { name: "Storage", value: "250 MB free space" },
      { name: "Internet", value: "WiFi or 4G LTE" }
    ],
    version_history: [
      { version: "9.13.51", date: "April 13, 2026", changes: ["Improved streaming quality", "Fixed audio codec issues", "Enhanced UI responsiveness"], size: "105.8 MB" },
      { version: "9.13.48", date: "April 5, 2026", changes: ["Playlist sync improvements", "Bug fixes"], size: "105.5 MB" }
    ]
  },
  {
    id: "flix-vision-v3.6.1r",
    name: "FLIX VISION Latest v3.6.1r Premium",
    description: "Latest v3.6.1r Premium Mod - 41.7 MB APK",
    long_description: "Premium streaming service with extensive movie and TV show library. Enjoy 4K content, offline downloads, and seamless multi-device streaming experience.",
    features: ["4K streaming quality", "Offline downloads", "Multiple simultaneous streams", "Ad-free experience", "Premium content library", "Personalized recommendations"],
    price: 0,
    category: "Entertainment",
    icon: "🎬",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 76540,
    installation_instructions: [
      { step: 1, title: "Download APK", description: "Download FLIX VISION v3.6.1r APK", details: "File size: 41.7 MB. Requires good internet connection for streaming." },
      { step: 2, title: "Allow Unknown Sources", description: "Enable app installation from unknown sources", details: "Go to Settings > Security > Unknown Sources." },
      { step: 3, title: "Install", description: "Tap the APK file and select Install", details: "Installation completes in about 1-2 minutes." },
      { step: 4, title: "Start Streaming", description: "Open the app and enjoy premium content", details: "Login with your credentials to access all premium features." }
    ],
    system_requirements: [
      { name: "Android Version", value: "6.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "150 MB free space" },
      { name: "Internet Speed", value: "10 Mbps for 4K streaming" }
    ],
    version_history: [
      { version: "3.6.1r", date: "April 13, 2026", changes: ["4K streaming support", "Fixed playback issues", "Improved UI responsiveness"], size: "41.7 MB" },
      { version: "3.6.0", date: "April 1, 2026", changes: ["Library expansion", "Performance optimization"], size: "41.5 MB" }
    ]
  },
  {
    id: "moviebox-latest-v3.0.13",
    name: "MovieBox Latest v3.0.13.0317.03",
    description: "Premium streaming platform with movies and series",
    long_description: "MovieBox Premium offers unlimited access to movies, TV series, and exclusive content. Stream in HD quality with offline download capability and fast streaming.",
    features: ["Movies and TV series library", "HD streaming quality", "Offline downloads", "Fast streaming", "No buffering", "Multiple subtitle options"],
    price: 0,
    category: "Entertainment",
    icon: "🎥",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vwaudWNB7O0SDwzE42tLtHhFbe0KOk.png",
    downloads: 89760,
    installation_instructions: [
      { step: 1, title: "Download APK", description: "Download MovieBox v3.0.13 APK file", details: "File size: 79.5 MB. Download on WiFi for faster installation." },
      { step: 2, title: "Enable Unknown Sources", description: "Allow installation from unknown sources", details: "Settings > Applications > Unknown sources > Enable." },
      { step: 3, title: "Install APK", description: "Open the APK file and tap Install", details: "Wait for installation to complete completely." },
      { step: 4, title: "Start Watching", description: "Launch MovieBox and explore the content library", details: "All premium features are unlocked for immediate use." }
    ],
    system_requirements: [
      { name: "Android Version", value: "5.0 and above" },
      { name: "RAM", value: "2 GB minimum" },
      { name: "Storage", value: "200 MB free space" },
      { name: "Internet", value: "4G/WiFi required" }
    ],
    version_history: [
      { version: "3.0.13.0317.03", date: "April 13, 2026", changes: ["Enhanced streaming performance", "UI improvements", "Bug fixes"], size: "79.5 MB" },
      { version: "3.0.12", date: "March 30, 2026", changes: ["Library update", "Performance optimization"], size: "79.2 MB" }
    ]
  }
];

async function seedData() {
  try {
    console.log('[v0] Starting to seed premium apps data...');

    for (const app of premiumAppsData) {
      const { data, error } = await supabase
        .from('premium_apps')
        .upsert([app], { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`[v0] Error upserting app ${app.id}:`, error);
      } else {
        console.log(`[v0] ✓ Seeded app: ${app.name}`);
      }
    }

    console.log('[v0] ✓ All apps seeded successfully!');
  } catch (error) {
    console.error('[v0] Fatal error during seeding:', error);
  }
}

seedData();
