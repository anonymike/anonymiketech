"use client"

import { motion } from "framer-motion"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <XCircle className="w-24 h-24 text-red-400 mx-auto" strokeWidth={1.5} />
        </motion.div>

        {/* Main Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-xl text-slate-300 mb-8">Your order was not completed</p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <p className="text-slate-300 mb-6">
              Your payment was cancelled. Don't worry, you haven't been charged. You can try again whenever you're ready.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
              <p className="text-slate-300 text-sm">
                <strong>Need help?</strong> If you encountered any issues during checkout, contact us at{" "}
                <a href="mailto:anonymiketech@gmail.com" className="text-blue-400 hover:text-blue-300">
                  anonymiketech@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link href="/vps" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
            Return to Plans
          </Link>
          <a
            href="mailto:anonymiketech@gmail.com"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
