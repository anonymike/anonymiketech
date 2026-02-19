import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  delay?: number;
  link?: string;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
}

export default function ServiceCard({
  title,
  description,
  icon,
  features,
  delay = 0,
  link,
  badge,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 30px hsl(var(--hacker-green))",
      }}
      className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm hover:bg-hacker-terminal/70 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Star-Shaped Badge in Top Corner */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: delay + 0.5,
            type: "spring",
            bounce: 0.8,
            duration: 1.2,
          }}
          className="absolute -top-2 -right-2 w-16 h-16 z-20"
        >
          {/* Rotating Star Background */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
            }}
            className="absolute inset-0"
          >
            {/* Star SVG Shape */}
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full"
              style={{
                filter: "drop-shadow(0 0 10px currentColor)",
              }}
            >
              <defs>
                <linearGradient
                  id="starGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <filter id="starGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main Star Shape */}
              <motion.path
                d="M32 4 L37 20 L54 20 L41 31 L46 47 L32 37 L18 47 L23 31 L10 20 L27 20 Z"
                fill="url(#starGradient)"
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#starGlow)"
                animate={{
                  fill: ["#10b981", "#059669", "#047857", "#10b981"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Inner Star Highlight */}
              <motion.path
                d="M32 10 L35 22 L46 22 L37 30 L40 42 L32 35 L24 42 L27 30 L18 22 L29 22 Z"
                fill="rgba(255,255,255,0.3)"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Badge Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 5px #ffffff",
                  "0 0 15px #ffffff",
                  "0 0 25px #ffffff",
                  "0 0 15px #ffffff",
                  "0 0 5px #ffffff",
                ],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                textShadow: { duration: 3, repeat: Infinity },
              }}
            >
              <div className="text-white font-tech font-bold text-[8px] leading-tight">
                NEW
              </div>
              <div className="text-white font-tech font-bold text-[6px] leading-tight">
                SERVERS
              </div>
            </motion.div>
          </div>

          {/* Orbiting Sparkles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: "50%",
                top: "50%",
                originX: 0.5,
                originY: 0.5,
              }}
              animate={{
                rotate: [0, 360],
                x: [0, Math.cos((i * 90 * Math.PI) / 180) * 25],
                y: [0, Math.sin((i * 90 * Math.PI) / 180) * 25],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}

          {/* Pulsing Outer Ring */}
          <motion.div
            className="absolute inset-0 border border-white/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Random Twinkle Effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`twinkle-${i}`}
              className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 3,
                repeatDelay: 2 + Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-hacker-green text-3xl group-hover:animate-pulse">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-hacker-green-bright glow-text group-hover:animate-flicker">
          {title}
        </h3>
      </div>

      <p className="text-hacker-green-dim mb-4 leading-relaxed">
        {description}
      </p>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 * (index + 1) }}
            className="flex items-center gap-2 text-hacker-green-bright"
          >
            <span className="text-hacker-green">▶</span>
            {feature}
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        {link ? (
          <Link
            to={link}
            className="inline-block px-4 py-2 glow-border rounded bg-hacker-terminal hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300 font-tech text-hacker-green-bright hover:animate-glow-pulse"
          >
            Learn More
          </Link>
        ) : (
          <button className="px-4 py-2 glow-border rounded bg-hacker-terminal hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300 font-tech text-hacker-green-bright hover:animate-glow-pulse">
            Learn More
          </button>
        )}
      </div>
    </motion.div>
  );
}
