import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCurrentYear } from "@/lib/date-utils"

export const metadata: Metadata = {
  title: "Cookie Policy - Codex Tech by ANONYMIKETECH",
  description: "Detailed information about cookies we use and how to manage them.",
}

export default function CookiePolicy() {
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
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300">
          {/* Section 1 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">What Are Cookies?</h2>
            <p className="text-gray-400 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us
              remember your preferences and understand how you interact with our site. Cookies are widely used across
              the internet to improve user experience and website functionality.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded border border-cyan-500/10">
                <h3 className="text-cyan-300 font-semibold mb-2">Essential Cookies</h3>
                <p className="text-gray-400 text-sm">
                  Required for basic functionality. These cookies enable core features like security and navigation.
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-cyan-500/10">
                <h3 className="text-cyan-300 font-semibold mb-2">Performance Cookies</h3>
                <p className="text-gray-400 text-sm">
                  Help us understand how users interact with our website and improve performance.
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-cyan-500/10">
                <h3 className="text-cyan-300 font-semibold mb-2">Preference Cookies</h3>
                <p className="text-gray-400 text-sm">
                  Remember your preferences and settings to personalize your experience.
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-cyan-500/10">
                <h3 className="text-cyan-300 font-semibold mb-2">Marketing Cookies</h3>
                <p className="text-gray-400 text-sm">
                  Used to deliver relevant advertisements and track campaign effectiveness.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Manage Cookies</h2>
            <div className="space-y-3 text-gray-400">
              <p>Most web browsers allow you to control cookies through settings. You can typically:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Accept or reject all cookies</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Accept cookies only from specific sites</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Delete cookies from your device</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-400 leading-relaxed">
              Our website may use third-party services that place cookies on your device for analytics, advertising, and
              other purposes. These services have their own privacy policies. We recommend reviewing their policies to
              understand how they use your data.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Consent</h2>
            <p className="text-gray-400 leading-relaxed">
              By accepting our cookie consent banner, you agree to our use of cookies as described in this policy. You
              can withdraw your consent at any time by clearing your browser cookies or changing your browser settings.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Updates to This Policy</h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of significant changes by updating
              the date at the top of this page. Your continued use of our website constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 md:p-8 hover:border-cyan-500/40 transition-colors">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Questions?</h2>
            <p className="text-gray-400 leading-relaxed">
              For questions about our cookie practices, please refer to our{" "}
              <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline">
                Privacy Policy
              </Link>{" "}
              or contact us at: contact@anonymiketech.com
            </p>
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
