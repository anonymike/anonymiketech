import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Timer, ArrowDown, Sparkles } from "lucide-react";
import { useOfferPricing } from "../hooks/useOfferPricing";

export default function OfferModal() {
  const { isOfferActive } = useOfferPricing();
  const [showModal, setShowModal] = useState(false);

  // Maintenance mode - set to false to enable offer modal
  const MAINTENANCE_MODE = false;

  useEffect(() => {
    if (isOfferActive) {
      // Show modal after 2 seconds on page load
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOfferActive]);

  if (!isOfferActive || MAINTENANCE_MODE) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-md lg:max-w-lg w-full text-white shadow-2xl relative overflow-hidden mx-2 my-4 max-h-[95vh] overflow-y-auto"
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
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 sm:mb-6 text-center"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2Fc37c6f36314142f2bf337eeeb7e6dfd7?format=webp&width=800"
                  alt="Weekend Vibes VPN Promotion"
                  className="w-48 h-40 sm:w-56 sm:h-48 lg:w-64 lg:h-52 mx-auto rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl border border-yellow-300/20 sm:border-2 sm:border-yellow-300/30"
                />
              </motion.div>

              <div className="text-center">
                {/* Lightning Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-3 sm:mb-4"
                >
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-yellow-300" />
                </motion.div>

                {/* Title with Weekend Vibes */}
                <motion.h2
                  animate={{
                    textShadow: [
                      "0 0 20px #fff",
                      "0 0 30px #fff, 0 0 40px #ff0",
                      "0 0 20px #fff",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-tech font-bold mb-3 sm:mb-4 flex items-center justify-center gap-1 sm:gap-2 leading-tight"
                >
                  🎉 WEEKEND VIBES! 🎉
                </motion.h2>

                {/* Weekend Pricing Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-300/30 sm:border-2 sm:border-yellow-300/40 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-tech font-bold text-yellow-300 mb-2 sm:mb-3 text-center"
                  >
                    WEEKEND SPECIAL PRICING
                  </motion.div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base font-tech text-white">
                    <div className="bg-white/10 rounded-md sm:rounded-lg p-2 sm:p-3 text-center hover:bg-white/20 transition-colors">
                      <div className="font-bold text-xs sm:text-sm">WEEKLY</div>
                      <div className="text-yellow-300 text-sm sm:text-base font-bold">KES 80</div>
                    </div>
                    <div className="bg-white/10 rounded-md sm:rounded-lg p-2 sm:p-3 text-center hover:bg-white/20 transition-colors">
                      <div className="font-bold text-xs sm:text-sm">TWO WEEKS</div>
                      <div className="text-yellow-300 text-sm sm:text-base font-bold">KES 160</div>
                    </div>
                    <div className="bg-white/10 rounded-md sm:rounded-lg p-2 sm:p-3 text-center hover:bg-white/20 transition-colors">
                      <div className="font-bold text-xs sm:text-sm">THREE WEEKS</div>
                      <div className="text-yellow-300 text-sm sm:text-base font-bold">KES 240</div>
                    </div>
                    <div className="bg-white/10 rounded-md sm:rounded-lg p-2 sm:p-3 text-center hover:bg-white/20 transition-colors">
                      <div className="font-bold text-xs sm:text-sm">MONTHLY</div>
                      <div className="text-yellow-300 text-sm sm:text-base font-bold">KES 300</div>
                    </div>
                  </div>
                </motion.div>

                {/* Timer Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
                  </motion.div>
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="font-tech text-xs sm:text-sm text-center"
                  >
                    Limited time only - Don't miss out!
                  </motion.span>
                </motion.div>

                {/* Enhanced View Offers Button */}
                <motion.button
                  onClick={() => setShowModal(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-orange-600 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full font-tech font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto relative overflow-hidden w-full sm:w-auto justify-center"
                >
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  <span className="relative z-10">View Offers</span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.button>

                {/* Bottom Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="flex items-center justify-center gap-1 mt-3 sm:mt-4 text-xs sm:text-sm opacity-75 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                  </motion.div>
                  <span className="px-1">Scroll down to see discounted prices</span>
                  <motion.div
                    animate={{ rotate: [360, 180, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
