import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            boxShadow: [
              "0 0 5px hsl(var(--hacker-green)), 0 0 10px hsl(var(--hacker-green))",
              "0 0 10px hsl(var(--hacker-green)), 0 0 20px hsl(var(--hacker-green)), 0 0 30px hsl(var(--hacker-green))",
              "0 0 5px hsl(var(--hacker-green)), 0 0 10px hsl(var(--hacker-green))",
            ],
          }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            boxShadow:
              "0 0 20px hsl(var(--hacker-green)), 0 0 40px hsl(var(--hacker-green))",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            duration: 0.5,
            boxShadow: { duration: 2, repeat: Infinity },
            rotate: { duration: 0.3 },
          }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 bg-hacker-terminal glow-border rounded-full hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300 group"
          aria-label="Back to top"
        >
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronUp className="w-6 h-6 text-hacker-green group-hover:text-hacker-bg" />
          </motion.div>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-20 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hacker-green to-transparent opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hacker-green to-transparent opacity-30"></div>
            </motion.div>
          </div>

          {/* Pulse Ring Effect */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-hacker-green pointer-events-none"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
