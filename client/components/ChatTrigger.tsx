import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function ChatTrigger() {
  const [isPressed, setIsPressed] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  // Auto-show/hide label every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLabel(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setShowLabel(false);
      }, 4000);
    }, 8000); // Show every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const handleChatOpen = () => {
    // Find and click the hidden Chatbase button
    const chatbaseButton = document.querySelector('#chatbase-bubble-button, [data-chatbase-widget="button"], iframe[src*="chatbase"]');

    if (chatbaseButton) {
      // If it's an iframe, try to trigger it
      if (chatbaseButton.tagName === 'IFRAME') {
        // Send a message to the iframe to open
        (chatbaseButton as HTMLIFrameElement).contentWindow?.postMessage('open', '*');
      } else {
        // Click the button
        (chatbaseButton as HTMLElement).click();
      }
    } else {
      // Fallback: try using the Chatbase API
      if (window.chatbase) {
        try {
          window.chatbase('open');
        } catch (e) {
          console.log('Chatbase API not available, trying alternative...');
        }
      }
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <motion.div
      initial={{ x: "calc(100% - 60px)" }}
      animate={{ x: "calc(100% - 60px)" }}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 chat-trigger-container"
    >
      <div className="relative">
        {/* Main Chat Button */}
        <motion.button
          onClick={handleChatOpen}
          className="w-14 h-20 rounded-l-full bg-hacker-green hover:bg-hacker-green-bright shadow-lg transition-all duration-300 flex items-center justify-center animate-glow-pulse"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: isPressed ? 0.95 : 1 }}
        >
          <MessageCircle className="w-6 h-6 text-hacker-bg" />
        </motion.button>

        {/* Pulse Ring Effect */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-l-full border-2 border-hacker-green pointer-events-none"
        />

        {/* Chat Label - Auto appearing/disappearing */}
        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                boxShadow: [
                  "0 0 5px hsl(var(--hacker-green))",
                  "0 0 15px hsl(var(--hacker-green))",
                  "0 0 5px hsl(var(--hacker-green))"
                ]
              }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{
                duration: 0.5,
                boxShadow: { duration: 2, repeat: Infinity }
              }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-hacker-terminal border border-hacker-green rounded-lg px-3 py-2 whitespace-nowrap shadow-lg"
            >
              <div className="text-sm font-tech text-hacker-green-bright glow-text">
                💬 Need Help?
              </div>
              <div className="text-xs font-tech text-hacker-green-dim">
                Live chat ANONYMIKE
              </div>

              {/* Arrow pointing to button */}
              <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-l-8 border-l-hacker-green border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Extend window type for TypeScript
declare global {
  interface Window {
    chatbase: any;
  }
}
