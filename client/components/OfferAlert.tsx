import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, Gift, Sparkles } from "lucide-react";
import { useOfferPricing } from "../hooks/useOfferPricing";

export default function OfferAlert() {
  const { isOfferActive } = useOfferPricing();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isOfferActive && !isDismissed) {
      // Show alert after 1 second when offer is active
      const timer = setTimeout(() => {
        setIsVisible(true);
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

  if (!isOfferActive || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Top Banner Alert */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 text-white shadow-2xl"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-6 h-6 text-yellow-300" />
                  </motion.div>
                  
                  <div className="flex items-center gap-2 font-tech font-bold">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-lg">SPECIAL OFFERS ACTIVE NOW!</span>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold ml-2"
                  >
                    SAVE UP TO 20%
                  </motion.div>
                </div>
                
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Floating Corner Alert */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            className="fixed bottom-4 left-4 z-40 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-2xl max-w-sm"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-8 h-8 text-yellow-300 flex-shrink-0" />
              </motion.div>
              
              <div>
                <h3 className="font-tech font-bold text-lg mb-1">
                  🎉 Limited Time!
                </h3>
                <p className="text-sm font-tech opacity-90">
                  VPN prices dropped! Get premium access for less.
                </p>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1 mt-2 text-xs"
                >
                  <Clock className="w-3 h-3" />
                  <span>Offer ends soon!</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Pulsing Offer Badge (sticks to pricing section) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
            className="fixed top-1/2 left-0 z-40 transform -translate-y-1/2"
          >
            <motion.div
              animate={{ 
                x: [0, 10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-red-500 text-white px-4 py-6 rounded-r-full shadow-lg"
            >
              <div className="transform -rotate-90 whitespace-nowrap font-tech font-bold text-sm">
                🔥 OFFERS ACTIVE 🔥
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
