import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Store, BookOpen, Sparkles, ExternalLink } from "lucide-react";

export default function BingwaServicesButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="relative">
            {/* Main Bingwa Services Button */}
            <motion.button
              onClick={toggleExpanded}
              className="relative group bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-4 rounded-xl font-tech font-bold text-lg shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: isExpanded 
                  ? "0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(236, 72, 153, 0.3)" 
                  : "0 0 20px rgba(168, 85, 247, 0.3)"
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                
                <span>🌟 CHECK OUT BINGWA SERVICES</span>
                
                <motion.div
                  animate={{ 
                    rotate: isExpanded ? 180 : 0,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 0.3 },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transform: "translateX(-100%)"
                }}
                animate={{
                  transform: isExpanded 
                    ? ["translateX(-100%)", "translateX(100%)", "translateX(-100%)"]
                    : "translateX(-100%)"
                }}
                transition={{
                  duration: 2,
                  repeat: isExpanded ? Infinity : 0,
                  ease: "linear"
                }}
              />
            </motion.button>

            {/* Expandable Section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-80 z-20"
                >
                  {/* Connection line */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-purple-500 to-transparent" />
                  
                  <div className="bg-hacker-terminal/95 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl p-6 shadow-2xl">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-6"
                    >
                      <h3 className="text-xl font-tech font-bold text-purple-400 glow-text mb-2">
                        🚀 BINGWA SERVICES
                      </h3>
                      <p className="text-sm text-hacker-green-dim">
                        Explore our premium services and resources
                      </p>
                    </motion.div>

                    {/* Service Buttons */}
                    <div className="space-y-4">
                      {/* Bingwa Store Button */}
                      <motion.a
                        href="https://bingwastore.co.ke/1/SHADDYDATAMTANI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg font-tech font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(234, 88, 12, 0.4)" 
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Store className="w-5 h-5 group-hover:animate-pulse" />
                        </motion.div>
                        
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold">🛒 Bingwa Store</div>
                          <div className="text-xs opacity-80">Premium Data Packages</div>
                        </div>
                        
                        <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </motion.a>

                      {/* Bingwa Blog Button */}
                      <motion.a
                        href="https://anonymiketech.blogspot.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg font-tech font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" 
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          animate={{ 
                            rotateY: [0, 180, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <BookOpen className="w-5 h-5 group-hover:animate-pulse" />
                        </motion.div>
                        
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold">📚 Bingwa Blog</div>
                          <div className="text-xs opacity-80">Tech Tips & Updates</div>
                        </div>
                        
                        <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    </div>

                    {/* Close hint */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center mt-4 pt-4 border-t border-purple-500/20"
                    >
                      <p className="text-xs text-hacker-green-dim">
                        💡 Click the main button again to close
                      </p>
                    </motion.div>
                  </div>

                  {/* Floating particles around the expanded section */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${10 + (i % 2) * 80}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
