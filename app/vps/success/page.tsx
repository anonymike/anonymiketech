"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Copy, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <CheckCircle className="w-24 h-24 text-green-400" strokeWidth={1.5} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-green-400/30"
            />
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-5xl font-bold mb-4">Order Confirmed! 🎉</h1>
          <p className="text-2xl text-slate-300 mb-8">Your VPS is being set up</p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 mb-8">
            <div className="text-left space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-2">Order ID</p>
                <div className="flex items-center gap-2 bg-slate-800/50 p-4 rounded-lg">
                  <code className="flex-1 font-mono text-sm break-all">{sessionId}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <p className="text-green-400 text-sm mt-2">Copied!</p>}
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-2">What happens next?</p>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold mt-0.5">✓</span>
                    <span>Your VPS is being provisioned and will be ready within 10 minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold mt-0.5">✓</span>
                    <span>You will receive login credentials via email shortly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold mt-0.5">✓</span>
                    <span>Access your control panel at <span className="text-blue-400">panel.anonymiketech.com</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold mt-0.5">✓</span>
                    <span>For support, contact <span className="text-blue-400">anonymiketech@gmail.com</span></span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Check your email for your invoice and server details
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-4 justify-center">
          <a
            href="https://panel.anonymiketech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
          >
            Access Control Panel
          </a>
          <Link href="/vps" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">
            Back to VPS Plans
          </Link>
        </motion.div>

        {/* Help Text */}
        <p className="text-slate-400 text-sm mt-12">
          Having issues? Email us at{" "}
          <a href="mailto:anonymiketech@gmail.com" className="text-blue-400 hover:text-blue-300">
            anonymiketech@gmail.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
