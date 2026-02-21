"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
  id: string
  title: string
  price: string
  period: string
  quantity: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
  onRequestDuplicateConfirmation?: (item: CartItem) => void
}

export default function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onRequestDuplicateConfirmation,
}: CartProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-hacker-terminal border-l border-hacker-green"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-hacker-green/30">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ShoppingCart className="w-6 h-6 text-hacker-green flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright truncate">
                    Cart ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-hacker-green/20 rounded-lg transition-colors flex-shrink-0 ml-2"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6 sm:w-5 sm:h-5 text-hacker-green" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-hacker-green-dim mx-auto mb-4" />
                    <p className="text-hacker-green-dim font-tech">
                      Your cart is empty... You Gotta do something buddy 😎
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glow-border rounded-lg p-4 bg-hacker-bg/50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-tech font-bold text-hacker-green-bright">{item.title}</h3>
                            <p className="text-hacker-green text-lg font-tech">
                              {item.price}/{item.period}
                            </p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-full bg-hacker-green/20 hover:bg-hacker-green/30 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-hacker-green" />
                            </button>
                            <span className="font-tech text-hacker-green-bright min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (onRequestDuplicateConfirmation) {
                                  onRequestDuplicateConfirmation(item)
                                } else {
                                  onUpdateQuantity(item.id, item.quantity + 1)
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-hacker-green/20 hover:bg-hacker-green/30 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-hacker-green" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-hacker-green/30">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheckout}
                    className="w-full py-4 px-6 bg-hacker-green text-hacker-bg font-tech font-bold rounded-lg hover:bg-hacker-green-bright transition-all duration-300 animate-glow-pulse"
                  >
                    💬 Checkout via WhatsApp
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
