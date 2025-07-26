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
}

export default function ServiceCard({
  title,
  description,
  icon,
  features,
  delay = 0,
  link,
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
      className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm hover:bg-hacker-terminal/70 transition-all duration-300 group"
    >
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
