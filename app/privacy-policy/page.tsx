import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCurrentYear } from "@/lib/date-utils"

export const metadata: Metadata = {
  title: "Privacy Policy - Codex Tech by ANONYMIKETECH",
  description: "Our privacy policy explaining how we protect your data and use cookies.",
}

export default function PrivacyPolicy() {
  const currentYear = getCurrentYear()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300">
          {/* Section 1 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Introduction</h2>
            <p className="text-gray-400 leading-relaxed">
              Welcome to Codex Tech by ANONYMIKETECH. We are committed to protecting your privacy and ensuring you have
              a positive experience on our website. This Privacy Policy explains our practices regarding the collection,
              use, and protection of your personal information.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Information We Collect</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Contact Information:</strong> Name, email address, phone number when you voluntarily provide
                  them
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Usage Data:</strong> Information about how you interact with our website through cookies and
                  analytics
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Device Information:</strong> Browser type, IP address, and operating system
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Service Data:</strong> Information provided when you use our services or purchase products
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Provide and improve our services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Communicate with you about updates and promotions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Analyze website performance and user behavior</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Detect and prevent fraudulent transactions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Cookie Policy</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use cookies to enhance your browsing experience. Please see our{" "}
              <Link href="/cookie-policy" className="text-cyan-400 hover:text-cyan-300 underline">
                detailed Cookie Policy
              </Link>{" "}
              for more information.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. However, no method
              of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Your Rights</h2>
            <p className="text-gray-400 leading-relaxed mb-4">You have the right to:</p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Access your personal information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Request correction of inaccurate data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Request deletion of your data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">7. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-slate-900/50 rounded border border-cyan-500/20">
              <p className="text-white font-semibold">ANONYMIKETECH</p>
              <p className="text-gray-400 text-sm mt-1">Email: contact@anonymiketech.com</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t border-gray-700 pt-8 mt-8">
            <p>© {currentYear} ANONYMIKETECH. All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
