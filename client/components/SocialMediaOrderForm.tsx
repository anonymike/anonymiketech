import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ExternalLink,
  Calculator,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MessageCircle,
  Camera,
  ArrowRight,
} from "lucide-react";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  minAmount: number;
  maxAmount: number;
  pricePerUnit: number;
  platform: string;
  isFree?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  services: ServiceOption[];
}

export default function SocialMediaOrderForm({
  isOpen,
  onClose,
  initialService,
}: OrderFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [link, setLink] = useState("");
  const [amount, setAmount] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [orderData, setOrderData] = useState<{
    service: ServiceOption | null;
    price: number;
    link: string;
    amount: number;
  } | null>(null);

  const categories: Category[] = [
    {
      id: "instagram",
      name: "Instagram Services",
      icon: "📷",
      services: [
        {
          id: "ig_followers",
          name: "Instagram Followers",
          basePrice: 120,
          minAmount: 500,
          maxAmount: 10000,
          pricePerUnit: 0.24,
          platform: "instagram",
        },
        {
          id: "ig_likes",
          name: "Instagram Likes",
          basePrice: 100,
          minAmount: 500,
          maxAmount: 5000,
          pricePerUnit: 0.2,
          platform: "instagram",
        },
        {
          id: "ig_views",
          name: "Instagram Views",
          basePrice: 50,
          minAmount: 1000,
          maxAmount: 10000,
          pricePerUnit: 0.05,
          platform: "instagram",
        },
        {
          id: "ig_comments",
          name: "Instagram Comments",
          basePrice: 150,
          minAmount: 50,
          maxAmount: 500,
          pricePerUnit: 3,
          platform: "instagram",
        },
      ],
    },
    {
      id: "tiktok",
      name: "TikTok Services",
      icon: "🎵",
      services: [
        {
          id: "tt_followers",
          name: "TikTok Followers",
          basePrice: 300,
          minAmount: 1000,
          maxAmount: 10000,
          pricePerUnit: 0.3,
          platform: "tiktok",
        },
        {
          id: "tt_likes",
          name: "TikTok Likes",
          basePrice: 250,
          minAmount: 1000,
          maxAmount: 10000,
          pricePerUnit: 0.25,
          platform: "tiktok",
        },
        {
          id: "tt_views",
          name: "TikTok Views",
          basePrice: 400,
          minAmount: 5000,
          maxAmount: 100000,
          pricePerUnit: 0.08,
          platform: "tiktok",
        },
        {
          id: "tt_shares",
          name: "TikTok Shares",
          basePrice: 200,
          minAmount: 100,
          maxAmount: 1000,
          pricePerUnit: 2,
          platform: "tiktok",
        },
        {
          id: "tt_free_likes",
          name: "50 Free TikTok Likes",
          basePrice: 0,
          minAmount: 50,
          maxAmount: 50,
          pricePerUnit: 0,
          platform: "tiktok",
          isFree: true,
        },
      ],
    },
    {
      id: "youtube",
      name: "YouTube Services",
      icon: "🎬",
      services: [
        {
          id: "yt_subscribers",
          name: "YouTube Subscribers",
          basePrice: 250,
          minAmount: 100,
          maxAmount: 5000,
          pricePerUnit: 2.5,
          platform: "youtube",
        },
        {
          id: "yt_views",
          name: "YouTube Views",
          basePrice: 300,
          minAmount: 1000,
          maxAmount: 100000,
          pricePerUnit: 0.3,
          platform: "youtube",
        },
        {
          id: "yt_likes",
          name: "YouTube Likes",
          basePrice: 150,
          minAmount: 100,
          maxAmount: 2000,
          pricePerUnit: 1.5,
          platform: "youtube",
        },
        {
          id: "yt_comments",
          name: "YouTube Comments",
          basePrice: 400,
          minAmount: 25,
          maxAmount: 200,
          pricePerUnit: 16,
          platform: "youtube",
        },
      ],
    },
    {
      id: "facebook",
      name: "Facebook Services",
      icon: "👥",
      services: [
        {
          id: "fb_page_likes",
          name: "Facebook Page Likes",
          basePrice: 200,
          minAmount: 500,
          maxAmount: 5000,
          pricePerUnit: 0.4,
          platform: "facebook",
        },
        {
          id: "fb_post_likes",
          name: "Facebook Post Likes",
          basePrice: 150,
          minAmount: 100,
          maxAmount: 2000,
          pricePerUnit: 1.5,
          platform: "facebook",
        },
        {
          id: "fb_followers",
          name: "Facebook Followers",
          basePrice: 250,
          minAmount: 500,
          maxAmount: 5000,
          pricePerUnit: 0.5,
          platform: "facebook",
        },
        {
          id: "fb_shares",
          name: "Facebook Shares",
          basePrice: 300,
          minAmount: 50,
          maxAmount: 500,
          pricePerUnit: 6,
          platform: "facebook",
        },
      ],
    },
    {
      id: "twitter",
      name: "Twitter/X Services",
      icon: "🐦",
      services: [
        {
          id: "tw_followers",
          name: "Twitter Followers",
          basePrice: 200,
          minAmount: 500,
          maxAmount: 5000,
          pricePerUnit: 0.4,
          platform: "twitter",
        },
        {
          id: "tw_likes",
          name: "Twitter Likes",
          basePrice: 150,
          minAmount: 500,
          maxAmount: 5000,
          pricePerUnit: 0.3,
          platform: "twitter",
        },
        {
          id: "tw_retweets",
          name: "Twitter Retweets",
          basePrice: 250,
          minAmount: 100,
          maxAmount: 1000,
          pricePerUnit: 2.5,
          platform: "twitter",
        },
        {
          id: "tw_replies",
          name: "Twitter Replies",
          basePrice: 400,
          minAmount: 25,
          maxAmount: 200,
          pricePerUnit: 16,
          platform: "twitter",
        },
      ],
    },
  ];

  const getSelectedService = (): ServiceOption | null => {
    const category = categories.find((cat) => cat.id === selectedCategory);
    if (!category) return null;
    return (
      category.services.find((service) => service.id === selectedService) ||
      null
    );
  };

  const calculatePrice = (): number => {
    const service = getSelectedService();
    if (!service) return 0;
    if (service.isFree) return 0;

    // Calculate price based on amount
    return Math.round(amount * service.pricePerUnit);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedCategory) newErrors.category = "Please select a category";
    if (!selectedService) newErrors.service = "Please select a service";
    if (!link.trim()) newErrors.link = "Please enter a valid link";

    const service = getSelectedService();
    if (service) {
      if (amount < service.minAmount) {
        newErrors.amount = `Minimum amount is ${service.minAmount}`;
      }
      if (amount > service.maxAmount) {
        newErrors.amount = `Maximum amount is ${service.maxAmount}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const service = getSelectedService();
    const price = calculatePrice();

    // Store order data for payment options
    setOrderData({
      service,
      price,
      link,
      amount,
    });

    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      setShowPaymentOptions(true);
    }, 1500);
  };

  const handleWhatsAppOrder = () => {
    if (!orderData?.service) return;

    const message =
      `🚀 NEW ORDER REQUEST\n\n` +
      `📱 Service: ${orderData.service.name}\n` +
      `🔗 Link: ${orderData.link}\n` +
      `📊 Amount: ${orderData.amount.toLocaleString()}\n` +
      `💰 Price: ${orderData.price === 0 ? "FREE" : `KES ${orderData.price.toLocaleString()}`}\n` +
      `📧 Platform: ${orderData.service.platform}\n\n` +
      `I want to place this order. Please confirm payment details.`;

    const whatsappUrl = `https://wa.me/+254782829321?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
    resetForm();
  };

  const handleDirectPayment = () => {
    if (!orderData?.service) return;

    // Open payment link
    window.open("https://anonymiketech-checkouts.vercel.app/", "_blank");

    // After a short delay, show payment confirmation instructions
    setTimeout(() => {
      const confirmMessage =
        `✅ PAYMENT CONFIRMATION\n\n` +
        `📱 Service: ${orderData.service?.name}\n` +
        `💰 Amount Paid: KES ${orderData.price.toLocaleString()}\n` +
        `🔗 Link: ${orderData.link}\n\n` +
        `Please send your payment screenshot to confirm this order.`;

      const whatsappUrl = `https://wa.me/+254782829321?text=${encodeURIComponent(confirmMessage)}`;
      window.open(whatsappUrl, "_blank");
    }, 2000);

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedService("");
    setLink("");
    setAmount(50);
    setErrors({});
    setShowPaymentOptions(false);
    setOrderData(null);
  };

  // Reset service when category changes
  useEffect(() => {
    setSelectedService("");
    const category = categories.find((cat) => cat.id === selectedCategory);
    if (category && category.services.length > 0) {
      setAmount(category.services[0].minAmount);
    }
  }, [selectedCategory]);

  // Update amount when service changes
  useEffect(() => {
    const service = getSelectedService();
    if (service) {
      setAmount(service.minAmount);
    }
  }, [selectedService]);

  // Set initial category for TikTok if initialService is provided
  useEffect(() => {
    if (initialService && initialService.includes("TIKTOK")) {
      setSelectedCategory("tiktok");
      setSelectedService("tt_free_likes");
    }
  }, [initialService]);

  if (!isOpen) return null;

  const service = getSelectedService();
  const price = calculatePrice();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-hacker-terminal border-2 border-hacker-green rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-tech font-bold text-hacker-green-bright glow-text">
              {showPaymentOptions ? "💳 Payment Options" : "📱 Create Order"}
            </h3>
            <button
              onClick={() => {
                if (showPaymentOptions) {
                  resetForm();
                }
                onClose();
              }}
              className="p-2 hover:bg-hacker-green/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-hacker-green" />
            </button>
          </div>

          <div className="space-y-4">
            {!showPaymentOptions && (
              <>
                {/* Choose Category */}
                <div>
                  <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                    Choose Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full bg-hacker-bg border-2 ${errors.category ? "border-red-500" : "border-hacker-green/30"} rounded-lg px-4 py-3 text-hacker-green-bright font-tech appearance-none cursor-pointer hover:border-hacker-green transition-colors`}
                    >
                      <option value="" disabled>
                        Select category...
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-hacker-green absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1 font-tech">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Choose Service */}
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                      Choose Service
                    </label>
                    <div className="relative">
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className={`w-full bg-hacker-bg border-2 ${errors.service ? "border-red-500" : "border-hacker-green/30"} rounded-lg px-4 py-3 text-hacker-green-bright font-tech appearance-none cursor-pointer hover:border-hacker-green transition-colors`}
                      >
                        <option value="" disabled>
                          Select service...
                        </option>
                        {categories
                          .find((cat) => cat.id === selectedCategory)
                          ?.services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}{" "}
                              {service.isFree
                                ? "(FREE)"
                                : `(KES ${service.basePrice}+)`}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-hacker-green absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.service && (
                      <p className="text-red-400 text-xs mt-1 font-tech">
                        {errors.service}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Enter Link */}
                {selectedService && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                      Enter Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder={`${service?.platform} post / video link`}
                        className={`w-full bg-hacker-bg border-2 ${errors.link ? "border-red-500" : "border-hacker-green/30"} rounded-lg px-4 py-3 pr-10 text-hacker-green-bright font-tech placeholder-hacker-green-dim hover:border-hacker-green focus:border-hacker-green transition-colors`}
                      />
                      <ExternalLink className="w-4 h-4 text-hacker-green-dim absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.link && (
                      <p className="text-red-400 text-xs mt-1 font-tech">
                        {errors.link}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Amount & Price */}
                {service && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          min={service.minAmount}
                          max={service.maxAmount}
                          className={`w-full bg-hacker-bg border-2 ${errors.amount ? "border-red-500" : "border-hacker-green/30"} rounded-lg px-4 py-3 text-hacker-green-bright font-tech hover:border-hacker-green focus:border-hacker-green transition-colors`}
                          disabled={service.isFree}
                        />
                        <Calculator className="w-4 h-4 text-hacker-green-dim absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {errors.amount && (
                        <p className="text-red-400 text-xs mt-1 font-tech">
                          {errors.amount}
                        </p>
                      )}
                      <p className="text-xs text-hacker-green-dim mt-1">
                        Min: {service.minAmount.toLocaleString()} - Max:{" "}
                        {service.maxAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                        Price
                      </label>
                      <div
                        className={`w-full border-2 border-hacker-green/30 rounded-lg px-4 py-3 font-tech font-bold text-right ${
                          service.isFree
                            ? "bg-green-900/20 text-green-400"
                            : "bg-hacker-bg text-hacker-green"
                        }`}
                      >
                        {service.isFree ? (
                          <span className="flex items-center justify-end gap-2">
                            🎁 Free
                          </span>
                        ) : (
                          `KES ${price.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Service Info */}
                {service && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-hacker-bg/50 rounded-lg p-4 border border-hacker-green/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-tech font-bold text-yellow-400">
                        Service Details
                      </span>
                    </div>
                    <div className="text-xs text-hacker-green-dim space-y-1">
                      <p>
                        • Platform:{" "}
                        {service.platform.charAt(0).toUpperCase() +
                          service.platform.slice(1)}
                      </p>
                      <p>• Delivery: 24-48 hours</p>
                      <p>
                        • Quality:{" "}
                        {service.isFree ? "Trial quality" : "Premium quality"}
                      </p>
                      {!service.isFree && (
                        <p>• Rate: KES {service.pricePerUnit} per unit</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                {selectedService && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className={`w-full py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting || Object.keys(errors).length > 0
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg hover:shadow-blue-500/30"
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Continue to Payment
                      </>
                    )}
                  </motion.button>
                )}
              </>
            )}

            {/* Payment Options */}
            {showPaymentOptions && orderData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Order Summary */}
                <div className="bg-hacker-bg/50 rounded-lg p-4 border border-hacker-green/30">
                  <h4 className="font-tech font-bold text-hacker-green-bright mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Order Ready!
                  </h4>
                  <div className="space-y-2 text-sm text-hacker-green-dim">
                    <p>
                      • Service:{" "}
                      <span className="text-hacker-green-bright">
                        {orderData.service?.name}
                      </span>
                    </p>
                    <p>
                      • Amount:{" "}
                      <span className="text-hacker-green-bright">
                        {orderData.amount.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      • Total Price:{" "}
                      <span className="text-2xl font-bold text-hacker-green">
                        {orderData.price === 0
                          ? "🎁 FREE"
                          : `KES ${orderData.price.toLocaleString()}`}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h4 className="font-tech font-bold text-hacker-green-bright text-center mb-4">
                    💳 Choose Payment Method
                  </h4>

                  {/* Direct Payment */}
                  {!orderData.service?.isFree && (
                    <motion.button
                      onClick={handleDirectPayment}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CreditCard className="w-5 h-5" />
                      💳 Pay Online - KES {orderData.price.toLocaleString()}
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  )}

                  {/* WhatsApp Order */}
                  <motion.button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    💬 Order via WhatsApp
                  </motion.button>
                </div>

                {/* Payment Instructions */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-tech font-bold text-yellow-400 mb-2">
                        📸 After Payment Instructions
                      </h5>
                      <div className="text-sm text-yellow-200 space-y-2">
                        <p>1. Complete your payment</p>
                        <p>2. Take a screenshot of payment confirmation</p>
                        <p>
                          3. Send screenshot to WhatsApp:{" "}
                          <strong>+254782829321</strong>
                        </p>
                        <p>4. Include your order details in the message</p>
                      </div>

                      <motion.button
                        onClick={() => {
                          const message =
                            `📸 PAYMENT SCREENSHOT\n\n` +
                            `Service: ${orderData.service?.name}\n` +
                            `🔗 Link: ${orderData.link}\n` +
                            `Amount: ${orderData.amount.toLocaleString()}\n` +
                            `Total: KES ${orderData.price.toLocaleString()}\n\n` +
                            `[Please attach your payment screenshot here]`;

                          const whatsappUrl = `https://wa.me/+254782829321?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, "_blank");
                        }}
                        className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg font-tech font-bold text-sm transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send Screenshot to WhatsApp
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <motion.button
                  onClick={() => setShowPaymentOptions(false)}
                  className="w-full bg-hacker-bg border-2 border-hacker-green/30 text-hacker-green-bright py-3 rounded-lg font-tech font-bold hover:border-hacker-green transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Back to Order Details
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
