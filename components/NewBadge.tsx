import { motion } from 'framer-motion'

export default function NewBadge() {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="ml-2 inline-flex items-center"
    >
      <motion.div
        animate={{ 
          boxShadow: [
            '0 0 8px rgba(34, 197, 94, 0.3)',
            '0 0 16px rgba(34, 197, 94, 0.6)',
            '0 0 8px rgba(34, 197, 94, 0.3)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-400 text-black"
      >
        NEW
      </motion.div>
    </motion.span>
  )
}
