import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Settings, Clock, Wrench, Zap } from "lucide-react";

export default function MaintenanceAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="maintenance-banner"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 text-black shadow-2xl"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Animated Icon - Desktop Only */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="hidden sm:block flex-shrink-0"
              >
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-orange-800" />
              </motion.div>
              
              {/* Main Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-orange-800 flex-shrink-0" />
                  <h3 className="text-sm sm:text-lg lg:text-xl font-tech font-bold text-orange-900 truncate">
                    🔧 SERVER UPGRADE
                  </h3>
                </div>
                
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-1 sm:gap-2">
                    <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-orange-800 mt-0.5 flex-shrink-0" />
                    <span className="font-tech text-orange-800 leading-tight">
                      Upgrading VPN servers for better performance
                    </span>
                  </div>

                  <div className="flex items-start gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-800 mt-0.5 flex-shrink-0" />
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="font-tech text-orange-800 font-bold leading-tight"
                    >
                      Resume at 4:00 PM + special offers!
                    </motion.span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Features Badge - Responsive */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden sm:flex items-center gap-1 sm:gap-2 bg-orange-800 text-yellow-100 px-2 sm:px-4 py-1 sm:py-2 rounded-full"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-tech font-bold text-xs sm:text-sm whitespace-nowrap">
                  4:00 PM Offers!
                </span>
              </motion.div>
            </div>
            
            {/* Close Button - Enhanced for Mobile */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 sm:p-2 hover:bg-orange-700/20 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-orange-800" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Overlay Message */}
      <motion.div
        key="maintenance-overlay"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          key="maintenance-modal"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-hacker-terminal border-2 border-yellow-500 rounded-lg p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl mx-2"
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-4 sm:mb-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h2
            animate={{ 
              textShadow: [
                "0 0 10px #fbbf24",
                "0 0 20px #fbbf24",
                "0 0 10px #fbbf24"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg sm:text-xl lg:text-2xl font-tech font-bold text-yellow-400 mb-3 sm:mb-4 leading-tight"
          >
            🛠️ Server Maintenance
          </motion.h2>
          
          {/* Message */}
          <div className="space-y-3 sm:space-y-4 text-hacker-green-bright">
            <p className="font-tech leading-relaxed text-sm sm:text-base">
              We're currently upgrading our VPN servers to provide you with 
              <strong className="text-yellow-400"> faster speeds</strong> and 
              <strong className="text-yellow-400"> better security</strong>.
            </p>
            
            <div className="bg-hacker-bg/50 rounded-lg p-3 sm:p-4 border border-yellow-500/30">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                <span className="font-tech font-bold text-yellow-400 text-sm sm:text-base">Comeback Schedule</span>
              </div>
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs sm:text-sm font-tech text-hacker-green-bright space-y-1 sm:space-y-2"
              >
                <p className="font-bold text-yellow-400 leading-tight">
                  ⏰ Services resume at exactly 4:00 PM today
                </p>
                <p className="leading-tight">
                  🎉 <strong className="text-yellow-400">Special Comeback Offer:</strong><br className="sm:hidden" />
                  4:00 PM to Midnight (00:00 AM)
                </p>
                <p className="text-xs sm:text-xs text-hacker-green-dim leading-tight">
                  Then regular offers resume: 6-10 PM weekdays + weekends
                </p>
              </motion.div>
            </div>
            
            <div className="text-xs sm:text-xs text-hacker-green-dim font-tech leading-tight">
              💡 Existing customers: Your active subscriptions remain valid
            </div>
          </div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-hacker-green/30"
          >
            <p className="text-xs sm:text-sm text-hacker-green-dim font-tech mb-2">
              Questions? Contact us:
            </p>
            <a
              href="https://wa.me/+254113313240"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-tech font-bold transition-colors text-sm touch-manipulation"
            >
              💬 WhatsApp Support
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
