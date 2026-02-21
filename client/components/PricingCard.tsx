import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  delay?: number;
}

export default function PricingCard({
  title,
  price,
  period,
  features,
  popular = false,
  delay = 0,
}: PricingCardProps) {
  // Payment page URL
  const paymentUrl = "https://anonymiketech-checkouts.vercel.app/";
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{
        scale: 1.05,
        boxShadow: popular
          ? "0 0 40px hsl(var(--hacker-green))"
          : "0 0 25px hsl(var(--hacker-green-dim))",
      }}
      className={`glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm relative ${
        popular
          ? "border-hacker-green animate-glow-pulse"
          : "border-hacker-green-dim"
      }`}
    >
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-hacker-green text-hacker-bg px-4 py-2 rounded-full font-tech font-bold text-sm flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-2 glow-text">
          {title}
        </h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-tech font-bold text-hacker-green">
            {price}
          </span>
          <span className="text-hacker-green-dim font-tech">/{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 * (index + 1) }}
            className="flex items-center gap-3 text-hacker-green-bright"
          >
            <div className="flex-shrink-0">
              <Check className="w-5 h-5 text-hacker-green" />
            </div>
            <span className="font-tech">{feature}</span>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.5 }}
        className="text-center"
      >
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block w-full py-4 px-6 rounded-lg font-tech font-bold transition-all duration-300 text-center ${
            popular
              ? "bg-hacker-green text-hacker-bg hover:bg-hacker-green-bright hover:animate-glow-pulse"
              : "glow-border bg-hacker-terminal text-hacker-green-bright hover:bg-hacker-green hover:text-hacker-bg"
          }`}
        >
          💳 Get Started
        </a>
      </motion.div>
    </motion.div>
  );
}
