import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Code,
  Bot,
  TrendingUp,
  Wifi,
  Globe,
  MessageSquare,
  Zap,
} from "lucide-react";
import MatrixRain from "../components/MatrixRain";
import Terminal from "../components/Terminal";
import ServiceCard from "../components/ServiceCard";
import ContactButtons from "../components/ContactButtons";
import MobileMenu from "../components/MobileMenu";
import BackToTop from "../components/BackToTop";

export default function Index() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Play hacker sound effect on load
    const playHackerSound = () => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create a simple beep sound effect
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        audioContext.currentTime + 0.1,
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Delayed content reveal for dramatic effect
    const timer = setTimeout(() => {
      setShowContent(true);
      try {
        playHackerSound();
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "Internet Services",
      description:
        "Secure VPN setups and Bingwa bundles for weekly & monthly internet access. Stay anonymous and connected.",
      icon: <Shield />,
      features: [
        "VPN Configuration & Setup",
        "Weekly Internet Bundles",
        "Monthly Data Packages",
        "Secure Anonymous Browsing",
        "24/7 Connection Support",
      ],
      link: "/internet-services",
    },
    {
      title: "Web Development & Design",
      description:
        "Modern responsive web solutions with cutting-edge animations, professional portfolios, and lightning-fast deployment.",
      icon: <Code />,
      features: [
        "Responsive Web Design",
        "React & Next.js Apps",
        "Portfolio Websites",
        "Fast Deployment",
        "SEO Optimization",
      ],
      link: "/web-development",
    },
    {
      title: "WhatsApp Bots & AI Chatbots",
      description:
        "Advanced chatbot automation, AI-driven messaging bots, and intelligent virtual assistants for business.",
      icon: <Bot />,
      features: [
        "WhatsApp Bot Development",
        "AI-Powered Chatbots",
        "Smart Virtual Assistants",
        "Automated Responses",
        "Business Integration",
      ],
      link: "/chatbots-ai",
    },
    {
      title: "Social Media Boosting",
      description:
        "Professional post design, audience engagement strategies, and automated scheduling tools for maximum reach.",
      icon: <TrendingUp />,
      features: [
        "Professional Post Design",
        "Audience Engagement",
        "Content Scheduling",
        "Growth Analytics",
        "Brand Strategy",
      ],
      link: "/social-media-boosting",
    },
  ];

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative overflow-hidden">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -50 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-8xl font-tech font-bold glow-text mb-4"
              animate={{
                textShadow: [
                  "0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00",
                  "0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00",
                  "0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ANONYMIKETECH
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ delay: 1.5 }}
              className="text-xl md:text-2xl text-hacker-green-bright mb-8 animate-flicker"
            >
              // Unleashing Digital Innovation & Cyber Excellence
            </motion.p>
          </div>
        </motion.header>

        {/* Terminal Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: showContent ? 1 : 0,
            scale: showContent ? 1 : 0.8,
          }}
          transition={{ delay: 2, duration: 1 }}
          className="container mx-auto px-4 mb-16"
        >
          <Terminal />
        </motion.section>

        {/* Services Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="container mx-auto px-4 mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 glow-text"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            // WHAT I DO
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
                link={service.link}
                delay={3.5 + index * 0.2}
              />
            ))}
          </div>
        </motion.section>

        {/* Features Highlight */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
          transition={{ delay: 4.5, duration: 1 }}
          className="container mx-auto px-4 mb-16"
        >
          <div className="glow-border rounded-lg p-8 bg-hacker-terminal/30 backdrop-blur-sm">
            <h3 className="text-3xl font-tech font-bold text-center mb-8 glow-text">
              // WHY CHOOSE ANONYMIKETECH?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Wifi className="w-12 h-12 mx-auto text-hacker-green animate-pulse" />
                <h4 className="font-tech text-hacker-green-bright">
                  Secure Networks
                </h4>
              </div>
              <div className="space-y-2">
                <Globe className="w-12 h-12 mx-auto text-hacker-green animate-pulse" />
                <h4 className="font-tech text-hacker-green-bright">
                  Global Access
                </h4>
              </div>
              <div className="space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-hacker-green animate-pulse" />
                <h4 className="font-tech text-hacker-green-bright">
                  AI Automation
                </h4>
              </div>
              <div className="space-y-2">
                <Zap className="w-12 h-12 mx-auto text-hacker-green animate-pulse" />
                <h4 className="font-tech text-hacker-green-bright">
                  Lightning Fast
                </h4>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
          transition={{ delay: 5, duration: 1 }}
          className="container mx-auto px-4 mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 glow-text"
            animate={{
              textShadow: [
                "0 0 5px #00ff00",
                "0 0 20px #00ff00",
                "0 0 5px #00ff00",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            // CONNECT WITH US
          </motion.h2>
          <ContactButtons />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 5.5, duration: 1 }}
          className="container mx-auto px-4 py-8 text-center"
        >
          <div className="glow-border rounded-lg p-6 bg-hacker-terminal/20 backdrop-blur-sm">
            <p className="font-tech text-hacker-green-dim mb-4">
              © 2024 ANONYMIKETECH - Digital Innovation & Cyber Excellence
            </p>
            <motion.p
              className="font-tech text-hacker-green mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              // "In code we trust, in anonymity we thrive" //
            </motion.p>
            <motion.p
              className="font-tech text-hacker-green-dim hover:text-hacker-green transition-colors duration-300"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              © anonymiketech_inc@2025
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
