import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Download, Zap, Shield, Bell, Sparkles, Rocket, ChevronDown, Eye, Play, Globe } from "lucide-react";

export default function VPNAppComingSoon() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set a future date for the app launch (example: 3 months from now)
    const launchDate = new Date();
    launchDate.setMonth(launchDate.getMonth() + 3);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-8 relative"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          {/* Trigger Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-tech font-bold text-lg shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: isExpanded 
                ? "0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(34, 211, 238, 0.3)" 
                : "0 0 20px rgba(34, 211, 238, 0.3)"
            }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: isExpanded ? [-100, 300] : [-100] }}
              transition={{ 
                duration: 3, 
                repeat: isExpanded ? Infinity : 0, 
                ease: "linear" 
              }}
            />

            {/* Button content */}
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              
              <span>🚀 PREVIEW OUR UPCOMING VPN APP</span>
              
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
          </motion.button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="overflow-hidden mt-8"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0.5, 1.5, 0.5],
                      opacity: [0.3, 1, 0.3],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {/* Main Announcement Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-r from-cyan-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-sm border-2 border-cyan-500/50 rounded-2xl p-8 md:p-12 relative overflow-hidden"
                  style={{
                    boxShadow: "0 0 40px rgba(34, 211, 238, 0.3), inset 0 0 40px rgba(34, 211, 238, 0.1)"
                  }}
                >
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34, 211, 238, 0.3)",
                        "0 0 40px rgba(34, 211, 238, 0.5)",
                        "0 0 20px rgba(34, 211, 238, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - App Info */}
                    <div>
                      {/* Header */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mb-8"
                      >
                        <motion.h2
                          className="text-3xl md:text-5xl font-tech font-bold glow-text mb-4"
                          animate={{ 
                            textShadow: [
                              "0 0 10px rgba(34, 211, 238, 0.5)",
                              "0 0 20px rgba(34, 211, 238, 0.8)",
                              "0 0 10px rgba(34, 211, 238, 0.5)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🚀 ANONYMIKETECH VPN APP
                        </motion.h2>
                        
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full font-tech font-bold text-lg shadow-lg"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ⚡
                          </motion.div>
                          COMING SOON
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                          >
                            ⚡
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Description & Features */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mb-8"
                      >
                        <p className="text-lg text-cyan-100 font-tech leading-relaxed mb-6">
                          Experience the next generation of VPN technology with our upcoming mobile app! 
                          Built specifically for ANONYMIKETECH users with cutting-edge features.
                        </p>
                        
                        <div className="space-y-4">
                          {[
                            { icon: <Smartphone className="w-5 h-5" />, title: "Native Mobile App", desc: "iOS & Android Support" },
                            { icon: <Shield className="w-5 h-5" />, title: "Enhanced Security", desc: "Military-Grade Encryption" },
                            { icon: <Zap className="w-5 h-5" />, title: "Lightning Fast", desc: "Optimized Performance" },
                            { icon: <Play className="w-5 h-5" />, title: "One-Tap Connect", desc: "Simplified User Experience" }
                          ].map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                              className="flex items-center gap-3 bg-cyan-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3"
                            >
                              <div className="text-cyan-400 flex-shrink-0">
                                {feature.icon}
                              </div>
                              <div>
                                <h4 className="font-tech font-bold text-white text-sm">{feature.title}</h4>
                                <p className="text-xs text-cyan-200 opacity-80">{feature.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Countdown Timer */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="mb-6"
                      >
                        <h3 className="text-xl font-tech font-bold text-cyan-300 mb-4">
                          🎯 EXPECTED LAUNCH
                        </h3>
                        
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: "DAYS", value: timeLeft.days },
                            { label: "HRS", value: timeLeft.hours },
                            { label: "MIN", value: timeLeft.minutes },
                            { label: "SEC", value: timeLeft.seconds }
                          ].map((unit, index) => (
                            <motion.div
                              key={unit.label}
                              className="bg-gradient-to-b from-cyan-800/50 to-blue-900/50 border border-cyan-500/30 rounded-lg p-2 text-center"
                              animate={{ 
                                borderColor: ["rgba(34, 211, 238, 0.3)", "rgba(34, 211, 238, 0.6)", "rgba(34, 211, 238, 0.3)"]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            >
                              <motion.div
                                key={unit.value}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-xl font-tech font-bold text-white"
                              >
                                {unit.value.toString().padStart(2, '0')}
                              </motion.div>
                              <div className="text-xs font-tech text-cyan-300 mt-1">
                                {unit.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Notify Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                      >
                        <motion.button
                          className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-tech font-bold shadow-2xl relative overflow-hidden w-full"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            window.open("https://www.whatsapp.com/channel/0029Vb4woXa17En19MxCLg32", "_blank");
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: [-100, 300] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          
                          <div className="relative z-10 flex items-center justify-center gap-3">
                            <Bell className="w-5 h-5" />
                            GET NOTIFIED WHEN READY
                          </div>
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Right Side - Mobile App Previews */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex justify-center"
                    >
                      <div className="relative">
                        {/* Phone Mockup 1 - Main Screen */}
                        <motion.div
                          className="relative z-20 bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-700"
                          style={{ width: "280px", height: "580px" }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {/* Phone Screen */}
                          <div className="bg-gradient-to-b from-gray-800 to-black rounded-[2.5rem] h-full w-full p-6 relative overflow-hidden">
                            {/* Status Bar */}
                            <div className="flex justify-between items-center text-white text-xs mb-6">
                              <span>9:41</span>
                              <div className="flex gap-1">
                                <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                                <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                                <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                              </div>
                            </div>

                            {/* App Header */}
                            <div className="text-center mb-8">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                              >
                                <Shield className="w-8 h-8 text-white" />
                              </motion.div>
                              <h3 className="text-white font-bold text-lg">ANONYMIKETECH</h3>
                              <p className="text-cyan-400 text-sm">VPN Protection</p>
                            </div>

                            {/* Connection Status */}
                            <div className="text-center mb-6">
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  boxShadow: [
                                    "0 0 20px rgba(34, 211, 238, 0.3)",
                                    "0 0 40px rgba(34, 211, 238, 0.6)",
                                    "0 0 20px rgba(34, 211, 238, 0.3)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer"
                              >
                                <motion.div
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                  <Zap className="w-12 h-12 text-white" />
                                </motion.div>
                              </motion.div>
                              <p className="text-green-400 font-bold">CONNECTED</p>
                              <p className="text-gray-400 text-sm">Kenya • Nairobi</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-cyan-400 text-sm">Upload</p>
                                <p className="text-white font-bold">2.4 MB/s</p>
                              </div>
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-cyan-400 text-sm">Download</p>
                                <p className="text-white font-bold">15.7 MB/s</p>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-3">
                              <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-cyan-400" />
                                  <span className="text-white text-sm">Change Server</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                              
                              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Shield className="w-5 h-5 text-purple-400" />
                                  <span className="text-white text-sm">Security Settings</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Phone Home Indicator */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
                        </motion.div>

                        {/* Floating Elements */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                            style={{
                              left: `${-20 + Math.random() * 340}px`,
                              top: `${50 + Math.random() * 500}px`
                            }}
                            animate={{
                              y: [0, -30, 0],
                              opacity: [0.3, 1, 0.3],
                              scale: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 4 + Math.random() * 2,
                              repeat: Infinity,
                              delay: i * 0.5,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
