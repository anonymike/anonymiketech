import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Timer, ArrowDown, Sparkles } from "lucide-react";
import { useOfferPricing } from "../hooks/useOfferPricing";

export default function OfferModal() {
  const { isOfferActive } = useOfferPricing();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOfferActive) {
      // Show modal after 2 seconds on page load
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOfferActive]);

  if (!isOfferActive) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 max-w-md w-full text-white shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-40 h-40 border-4 border-yellow-300 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-32 h-32 border-4 border-yellow-300 rounded-full"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Zap className="w-16 h-16 mx-auto text-yellow-300" />
              </motion.div>

              <motion.h2
                animate={{ 
                  textShadow: [
                    "0 0 20px #fff",
                    "0 0 30px #fff, 0 0 40px #ff0",
                    "0 0 20px #fff"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl font-tech font-bold mb-4"
              >
                🎉 SPECIAL OFFERS LIVE! 🎉
              </motion.h2>

              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl font-tech font-bold text-yellow-300 mb-2"
                >
                  SAVE UP TO 20%
                </motion.div>
                <p className="font-tech">
                  on all VPN packages right now!
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Timer className="w-5 h-5 text-yellow-300" />
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="font-tech text-sm"
                >
                  Limited time only - Don't miss out!
                </motion.span>
              </div>

              <motion.button
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-tech font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <span>View Offers</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <div className="flex items-center justify-center gap-1 mt-4 text-xs opacity-75">
                <Sparkles className="w-3 h-3" />
                <span>Scroll down to see discounted prices</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
