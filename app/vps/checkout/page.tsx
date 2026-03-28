"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, AlertCircle, Check, Loader } from "lucide-react"
import Link from "next/link"

const VPS_PLANS = {
  "s-plan": { name: "VPS S - Starter", basePrice: 7.5, cpu: 3, ram: 6, storage: 50 },
  "m-plan": { name: "VPS M - Professional", basePrice: 11.4, cpu: 6, ram: 16, storage: 100 },
  "l-plan": { name: "VPS L - Business", basePrice: 19.6, cpu: 8, ram: 32, storage: 200 },
  "xl-plan": { name: "VPS XL - Enterprise", basePrice: 36, cpu: 12, ram: 64, storage: 400 },
}

const LOCATIONS = [
  { id: "us-dallas", name: "US (Dallas)", flag: "🇺🇸" },
  { id: "de-frankfurt", name: "Germany (Frankfurt)", flag: "🇩🇪" },
  { id: "za-johannesburg", name: "South Africa (Johannesburg)", flag: "🇿🇦" },
  { id: "ae-dubai", name: "UAE (Dubai)", flag: "🇦🇪" },
  { id: "sg-singapore", name: "Singapore", flag: "🇸🇬" },
]

const BILLING_CYCLES = [
  { id: "1month", label: "1 Month", months: 1, discount: 0 },
  { id: "3months", label: "3 Months", months: 3, discount: 0.2, badge: "SAVE 20%" },
  { id: "6months", label: "6 Months", months: 6, discount: 0.1, badge: "SAVE 10%" },
  { id: "12months", label: "12 Months", months: 12, discount: 0.15, badge: "SAVE 15%" },
]

const OPERATING_SYSTEMS = [
  { id: "ubuntu", name: "Ubuntu", version: "24.04", logo: "🐧" },
  { id: "debian", name: "Debian", version: "12", logo: "🐦" },
  { id: "almalinux", name: "AlmaLinux", version: "9", logo: "🔴" },
  { id: "archlinux", name: "Arch Linux", version: "Latest", logo: "🐘" },
  { id: "windows", name: "Windows", version: "Server 2022", logo: "🪟" },
]

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = (searchParams.get("plan") as keyof typeof VPS_PLANS) || "m-plan"
  const currencyParam = searchParams.get("currency") || "USD"
  const currency = currencyParam as "USD" | "KSH"

  const plan = VPS_PLANS[planId]
  const exchangeRate = 135

  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [location, setLocation] = useState("us-dallas")
  const [billingCycle, setBillingCycle] = useState("3months")
  const [selectedOS, setSelectedOS] = useState("ubuntu")
  const [hostname, setHostname] = useState("")
  const [sshKey, setSSHKey] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getBillingCycle = () => BILLING_CYCLES.find((bc) => bc.id === billingCycle)!
  const cycleData = getBillingCycle()
  const basePrice = plan.basePrice + 2 // Add $2 margin

  // Calculate price
  const monthlyPrice = basePrice
  const totalPrice = monthlyPrice * cycleData.months * (1 - cycleData.discount)
  const promoDiscount = appliedPromo ? totalPrice * appliedPromo.discount : 0
  const finalPrice = totalPrice - promoDiscount

  // Convert currency
  const getDisplayPrice = (price: number) => {
    if (currency === "KSH") {
      return Math.round(price * exchangeRate)
    }
    return price.toFixed(2)
  }

  const currencySymbol = currency === "USD" ? "$" : "KSH "

  // Validation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 3) {
      if (!hostname.trim()) newErrors.hostname = "Hostname is required"
      if (!hostname.match(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/)) {
        newErrors.hostname = "Invalid hostname format"
      }
    }

    if (step === 4) {
      if (!sshKey.trim()) newErrors.sshKey = "SSH public key is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleApplyPromo = () => {
    // Simple promo code validation
    if (promoCode.toLowerCase() === "welcome20") {
      setAppliedPromo({ code: promoCode, discount: 0.2 })
    } else if (promoCode.toLowerCase() === "anonymiketech10") {
      setAppliedPromo({ code: promoCode, discount: 0.1 })
    } else {
      setErrors({ promoCode: "Invalid promo code" })
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setErrors({})
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      // Create order data
      const orderData = {
        plan: planId,
        location,
        billingCycle,
        os: selectedOS,
        hostname,
        sshKey,
        promoCode: appliedPromo?.code || null,
        currency,
        pricing: {
          basePrice,
          monthlyPrice,
          totalPrice,
          discount: cycleData.discount * 100,
          promoDiscount,
          finalPrice,
        },
      }

      // Redirect to payment
      const response = await fetch("/api/vps/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        // Redirect to Stripe checkout (we'll set this up next)
        window.location.href = `/api/vps/checkout/${sessionId}`
      } else {
        setErrors({ submit: "Failed to create checkout session" })
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    { number: 1, title: "Location", icon: "🌍" },
    { number: 2, title: "Billing Cycle", icon: "📅" },
    { number: 3, title: "Operating System", icon: "🖥️" },
    { number: 4, title: "Configuration", icon: "⚙️" },
    { number: 5, title: "Payment", icon: "💳" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/vps" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            ← Back to Plans
          </Link>
          <h1 className="text-4xl font-bold mb-2">Complete Your Order</h1>
          <p className="text-slate-400">Step {currentStep} of {steps.length}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 flex justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step.number ? "bg-blue-600" : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-8 border border-slate-700"
            >
              {/* Step 1: Location */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Server Location</h2>
                  <div className="space-y-3">
                    {LOCATIONS.map((loc) => (
                      <label
                        key={loc.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all border-2 ${
                          location === loc.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="location"
                          value={loc.id}
                          checked={location === loc.id}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-2xl ml-4">{loc.flag}</span>
                        <span className="ml-4 font-semibold">{loc.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Billing Cycle */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Choose Billing Cycle</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BILLING_CYCLES.map((cycle) => (
                      <label
                        key={cycle.id}
                        className={`relative flex items-start p-6 rounded-lg cursor-pointer transition-all border-2 ${
                          billingCycle === cycle.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                        }`}
                      >
                        {cycle.badge && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            {cycle.badge}
                          </div>
                        )}
                        <input
                          type="radio"
                          name="billing"
                          value={cycle.id}
                          checked={billingCycle === cycle.id}
                          onChange={(e) => setBillingCycle(e.target.value)}
                          className="w-4 h-4 mt-1"
                        />
                        <div className="ml-4">
                          <div className="font-semibold">{cycle.label}</div>
                          <div className="text-slate-400 text-sm">
                            {currencySymbol}{getDisplayPrice(monthlyPrice * cycle.months * (1 - cycle.discount))} total
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Operating System */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Choose Operating System</h2>
                  <div className="space-y-3">
                    {OPERATING_SYSTEMS.map((os) => (
                      <label
                        key={os.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all border-2 ${
                          selectedOS === os.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="os"
                          value={os.id}
                          checked={selectedOS === os.id}
                          onChange={(e) => setSelectedOS(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-2xl ml-4">{os.logo}</span>
                        <div className="ml-4">
                          <div className="font-semibold">{os.name}</div>
                          <div className="text-slate-400 text-sm">{os.version}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Configuration */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Server Configuration</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Hostname</label>
                    <input
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      placeholder="vm513voko.yourlocaldomain.com"
                      className={`w-full bg-slate-700 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.hostname ? "border-red-500" : "border-slate-600"
                      }`}
                    />
                    {errors.hostname && <p className="text-red-400 text-sm mt-1">{errors.hostname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">SSH Public Key</label>
                    <textarea
                      value={sshKey}
                      onChange={(e) => setSSHKey(e.target.value)}
                      placeholder="Paste your SSH public key here (ssh-rsa AAAA...)"
                      className={`w-full bg-slate-700 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none h-32 ${
                        errors.sshKey ? "border-red-500" : "border-slate-600"
                      }`}
                    />
                    {errors.sshKey && <p className="text-red-400 text-sm mt-1">{errors.sshKey}</p>}
                    <p className="text-slate-400 text-xs mt-2">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      SSH key is required for secure access to your server
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Review & Pay</h2>

                  <div className="bg-slate-700/30 rounded-lg p-6 space-y-4 mb-6 border border-slate-600">
                    <h3 className="font-semibold text-lg">Order Summary</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Plan:</span>
                        <span>{plan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span>{LOCATIONS.find((l) => l.id === location)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">OS:</span>
                        <span>{OPERATING_SYSTEMS.find((o) => o.id === selectedOS)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hostname:</span>
                        <span className="text-right font-mono text-xs">{hostname}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  {!appliedPromo ? (
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value)
                          setErrors({})
                        }}
                        placeholder="Promo code"
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 mb-6">
                      <span className="text-green-400">
                        <Check className="w-4 h-4 inline mr-2" />
                        Promo applied: {appliedPromo.code}
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-green-400 hover:text-green-300 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {errors.promoCode && <p className="text-red-400 text-sm mb-6">{errors.promoCode}</p>}

                  <div className="border-t border-slate-600 pt-6">
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Subtotal:</span>
                        <span>{currencySymbol}{getDisplayPrice(totalPrice)}</span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm mb-2 text-green-400">
                        <span>Discount ({(appliedPromo!.discount * 100).toFixed(0)}%):</span>
                        <span>-{currencySymbol}{getDisplayPrice(promoDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span>{currencySymbol}{getDisplayPrice(finalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                  >
                    ← Back
                  </button>
                )}

                {currentStep < 5 && (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentStep === 5 && (
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                      </>
                    )}
                  </button>
                )}
              </div>

              {errors.submit && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  {errors.submit}
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Plan</div>
                  <div className="font-semibold">{plan.name}</div>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-400">Monthly:</span>
                    <span>{currencySymbol}{getDisplayPrice(monthlyPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-400">Months:</span>
                    <span>× {cycleData.months}</span>
                  </div>
                  {cycleData.discount > 0 && (
                    <div className="flex justify-between text-sm mb-3 text-green-400">
                      <span>Discount:</span>
                      <span>-{(cycleData.discount * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm mb-3 text-green-400">
                      <span>Promo Discount:</span>
                      <span>-{currencySymbol}{getDisplayPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-3 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{currencySymbol}{getDisplayPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 text-sm">
                <p className="text-slate-300">
                  You'll be able to configure DNS, backups, and snapshots after purchase in your control panel.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
