import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles, Star, Rocket, Gift } from "lucide-react";

export default function ComingSoon() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {/* Top Banner */}
      <motion.div
        key="coming-soon-banner"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-2xl overflow-hidden"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100],
                y: [0, Math.random() * 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 relative">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Animated Icons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                >
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" />
                </motion.div>
              </div>

              {/* Main Message */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  animate={{
                    textShadow: [
                      "0 0 10px #fff",
                      "0 0 20px #fff",
                      "0 0 30px #fff",
                      "0 0 20px #fff",
                      "0 0 10px #fff",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg sm:text-xl lg:text-2xl font-tech font-bold text-white truncate"
                >
                  🚀 STAY TUNED - SOMETHING BIG COMING SOON!
                </motion.h3>
                <motion.div
                  className="space-y-1 text-xs sm:text-sm"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                    <span className="font-tech text-yellow-100 leading-tight">
                      Revolutionary features launching soon
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-pink-300 flex-shrink-0" />
                    <span className="font-tech text-pink-100 font-bold leading-tight">
                      Amazing surprises await!
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Animated Badge */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotateY: [0, 180, 360],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="hidden sm:flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-tech font-bold text-xs sm:text-sm whitespace-nowrap">
                  GET READY!
                </span>
              </motion.div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating Overlay */}
      <motion.div
        key="coming-soon-overlay"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          key="coming-soon-modal"
          initial={{ y: 50, opacity: 0, rotateX: -15 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
          className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-gradient-to-r border-purple-400 rounded-xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl mx-2 relative overflow-hidden"
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0.2, 0.8, 0],
                  scale: [1, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Icon Animation */}
            <motion.div
              className="mb-4 sm:mb-6"
              animate={{
                y: [0, -10, 0],
                rotateZ: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              animate={{
                textShadow: [
                  "0 0 10px #8b5cf6",
                  "0 0 20px #8b5cf6",
                  "0 0 30px #8b5cf6",
                  "0 0 20px #8b5cf6",
                  "0 0 10px #8b5cf6",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-xl sm:text-2xl lg:text-3xl font-tech font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text mb-3 sm:mb-4 leading-tight"
            >
              🌟 SOMETHING BIG IS COMING!
            </motion.h2>

            {/* Main Message */}
            <div className="space-y-3 sm:space-y-4 text-white">
              <motion.p
                className="font-tech leading-relaxed text-sm sm:text-base"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                We're cooking up something
                <strong className="text-yellow-400">
                  {" "}
                  absolutely amazing
                </strong>{" "}
                for you!
                <strong className="text-pink-400">
                  {" "}
                  Revolutionary features
                </strong>{" "}
                are on the way.
              </motion.p>

              {/* Feature Teasers */}
              <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                <motion.div
                  className="text-xs sm:text-sm font-tech text-gray-200 space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚡
                    </motion.div>
                    <span className="text-yellow-300 font-bold">
                      Next-level performance
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🎁
                    </motion.div>
                    <span className="text-pink-300 font-bold">
                      Exclusive offers & surprises
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🚀
                    </motion.div>
                    <span className="text-purple-300 font-bold">
                      Game-changing innovations
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="text-xs sm:text-sm text-gray-300 font-tech leading-tight"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                💡 Stay connected with us for the big reveal!
              </motion.div>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-500/30"
            >
              <p className="text-xs sm:text-sm text-gray-300 font-tech mb-2">
                Questions? We're here for you:
              </p>
              <motion.a
                href="https://wa.me/+254113313240"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 text-white px-3 sm:px-4 py-2 rounded-lg font-tech font-bold transition-all duration-300 text-sm touch-manipulation shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 WhatsApp Support
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
