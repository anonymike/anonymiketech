"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CarIcon as CartIcon, X, Trash2, ArrowRight, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter, usePathname } from "next/navigation"

export default function ShoppingCart() {
  const { items, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [previousItemCount, setPreviousItemCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const isWebDevPage = pathname === "/web-development"

  useEffect(() => {
    const currentCount = getTotalItems()
    if (currentCount > previousItemCount && currentCount > 0) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
    setPreviousItemCount(currentCount)
  }, [items])

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  if (!isWebDevPage || getTotalItems() === 0) {
    return null
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-40 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all border-2 border-white/20"
        animate={{
          boxShadow:
            getTotalItems() > 0
              ? [
                  "0 0 20px rgba(16, 185, 129, 0.4)",
                  "0 0 40px rgba(16, 185, 129, 0.6)",
                  "0 0 20px rgba(16, 185, 129, 0.4)",
                ]
              : "0 0 20px rgba(16, 185, 129, 0.4)",
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
        }}
      >
        <CartIcon className="w-7 h-7" />
        {getTotalItems() > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white"
          >
            {getTotalItems()}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Item Added to Cart!</p>
              <p className="text-sm text-white/90">You have {getTotalItems()} item(s) in your cart</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-l border-emerald-500/30 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Shopping Cart
                  </h2>
                  <p className="text-slate-400 text-sm">{getTotalItems()} item(s) in cart</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center mb-4">
                      <CartIcon className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="text-slate-400 text-lg font-medium">Your cart is empty</p>
                    <p className="text-slate-500 text-sm mt-2">Add some services to get started</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 space-y-3 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{item.type}</h3>
                          <p className="text-sm text-slate-400 mt-1">{item.domain}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                        <span className="text-slate-400 text-sm">
                          {item.quantity}x @ KSH {item.price.toLocaleString()}
                        </span>
                        <span className="font-bold text-emerald-400 text-lg">
                          KSH {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-slate-700/50 p-6 space-y-4 bg-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal:</span>
                      <span className="font-bold">KSH {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Discount:</span>
                      <span className="font-bold text-emerald-400">-10%</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-slate-700/50">
                      <span>Total:</span>
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        KSH {(getTotalPrice() * 0.9).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
