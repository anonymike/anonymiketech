import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Code, Bot, TrendingUp, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileMenuProps {
  showAfterIntro?: boolean;
}

export default function MobileMenu({ showAfterIntro = true }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Internet Services",
      path: "/internet-services",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Web Development",
      path: "/web-development",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "AI Chatbots",
      path: "/chatbots-ai",
      icon: <Bot className="w-5 h-5" />,
    },
    {
      name: "Social Media Boosting",
      path: "/social-media-boosting",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  if (!isMobile || !showAfterIntro) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-hacker-terminal glow-border rounded-lg hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-hacker-green" />
          ) : (
            <Menu className="w-6 h-6 text-hacker-green" />
          )}
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-hacker-terminal glow-border z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-hacker-green/20 to-hacker-terminal p-6 border-b border-hacker-green">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-hacker-green rounded-lg flex items-center justify-center">
                    <span className="text-hacker-bg font-tech font-bold text-sm">
                      A
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-tech font-bold text-hacker-green-bright glow-text">
                      ANONYMIKETECH
                    </h2>
                    <p className="text-xs text-hacker-green-dim">
                      Digital Innovation & Cyber Excellence
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-4 rounded-lg font-tech transition-all duration-300 ${
                        location.pathname === item.path
                          ? "bg-hacker-green text-hacker-bg animate-glow-pulse"
                          : "text-hacker-green-bright hover:bg-hacker-green/20 hover:text-hacker-green"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-hacker-green/30">
                <div className="text-center space-y-3">
                  <p className="text-sm font-tech text-hacker-green-dim">
                    Need Help?
                  </p>
                  <a
                    href="https://wa.me/+254113313240"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-hacker-green text-hacker-bg px-4 py-2 rounded-lg font-tech font-bold hover:bg-hacker-green-bright transition-all duration-300"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="text-9xl font-tech font-bold text-hacker-green animate-pulse select-none overflow-hidden">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="animate-matrix-fall"
                      style={{
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                      }}
                    >
                      01010101
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
