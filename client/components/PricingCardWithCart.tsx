import { motion } from "framer-motion";
import { Check, Star, Plus, Info } from "lucide-react";

interface PricingCardWithCartProps {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  delay?: number;
  hasDiscount?: boolean;
  originalPrice?: string;
  onAddToCart: (item: {
    id: string;
    title: string;
    price: string;
    period: string;
  }) => void;
  onMoreDetails?: (packageData: {
    id: string;
    title: string;
    price: string;
    period: string;
    features: string[];
    popular?: boolean;
    hasDiscount?: boolean;
    originalPrice?: string;
  }) => void;
}

export default function PricingCardWithCart({
  id,
  title,
  price,
  period,
  features,
  popular = false,
  delay = 0,
  hasDiscount = false,
  originalPrice,
  onAddToCart,
  onMoreDetails,
}: PricingCardWithCartProps) {
  const handleAddToCart = () => {
    onAddToCart({ id, title, price, period });
  };

  const handleMoreDetails = () => {
    if (onMoreDetails) {
      onMoreDetails({
        id,
        title,
        price,
        period,
        features,
        popular,
        hasDiscount,
        originalPrice,
      });
    }
  };

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

        {hasDiscount && originalPrice ? (
          <div className="space-y-1">
            {/* Original Price (crossed out) */}
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-2xl font-tech font-bold text-hacker-green-dim line-through opacity-60">
                {originalPrice}
              </span>
              <span className="text-hacker-green-dim font-tech text-sm">/{period}</span>
            </div>

            {/* Discounted Price */}
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-tech font-bold text-yellow-400 animate-pulse">
                {price}
              </span>
              <span className="text-yellow-300 font-tech">/{period}</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-red-500 text-white text-xs font-tech font-bold px-2 py-1 rounded-full ml-2"
              >
                SALE!
              </motion.span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-tech font-bold text-hacker-green">
              {price}
            </span>
            <span className="text-hacker-green-dim font-tech">/{period}</span>
          </div>
        )}
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
      >
        {/* Secure This Button */}
        {onMoreDetails && (
          <motion.button
            onClick={handleMoreDetails}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg font-tech font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-green-500/50 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated Background Pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Icon Animation */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🔒
            </motion.div>

            {/* Animated Text */}
            <motion.span
              className="relative z-10"
              animate={{
                textShadow: [
                  "0 0 10px #10b981",
                  "0 0 20px #10b981",
                  "0 0 30px #10b981",
                  "0 0 20px #10b981",
                  "0 0 10px #10b981"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Secure This
            </motion.span>

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
