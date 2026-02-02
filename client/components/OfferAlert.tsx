import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, Gift, Sparkles } from "lucide-react";
import { useOfferPricing } from "../hooks/useOfferPricing";

export default function OfferAlert() {
  const { isOfferActive } = useOfferPricing();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Maintenance mode - set to false to enable offer alerts
  const MAINTENANCE_MODE = false;

  useEffect(() => {
    if (isOfferActive && !isDismissed) {
      // Show alert after 1 second when offer is active
      const timer = setTimeout(() => {
        setIsVisible(true);

        // Auto scroll to top smoothly when banner appears
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 200); // Small delay to let the banner animate in first
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOfferActive, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isOfferActive || isDismissed || MAINTENANCE_MODE) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 shadow-2xl"
        >
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Weekend Vibes Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2Fc37c6f36314142f2bf337eeeb7e6dfd7?format=webp&width=800"
                  alt="Weekend Vibes Offers"
                  className="w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-18 rounded-lg shadow-lg border border-yellow-300/30"
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300" />
                  </motion.div>

                  <div className="text-white">
                    <div className="font-tech font-bold text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-2">
                      <span>WEEKEND VIBES!</span>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-yellow-500 text-orange-800 px-1 sm:px-2 py-0.5 rounded text-xs font-bold"
                      >
                        LIVE
                      </motion.div>
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-100 font-tech">
                      Special pricing on all VPN packages
                    </div>
                  </div>
                </div>

                {/* Quick Pricing Display */}
                <div className="hidden sm:flex items-center gap-2 text-white text-xs md:text-sm font-tech">
                  <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1 border border-yellow-300/20">
                    <div className="text-yellow-300 font-bold">From KES 80</div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            {/* Mobile Pricing Row */}
            <div className="sm:hidden mt-2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-300/20">
                <span className="text-yellow-300 font-tech font-bold text-xs">Starting from KES 80</span>
              </div>
            </div>
          </div>

          {/* Animated border bottom */}
          <motion.div
            className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 100%"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
