import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import MatrixRain from "../components/MatrixRain";

interface PaymentStatus {
  status: "success" | "failed" | "pending" | "cancelled";
  transactionId?: string;
  amount?: string;
  phoneNumber?: string;
  service?: string;
  message?: string;
}

export default function PaymentCallback() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL parameters from smartpaypesa callback
    const urlParams = new URLSearchParams(location.search);

    // Extract payment data from URL parameters
    const status = urlParams.get("status") || urlParams.get("ResultCode");
    const transactionId =
      urlParams.get("transactionId") || urlParams.get("CheckoutRequestID");
    const amount = urlParams.get("amount") || urlParams.get("Amount");
    const phoneNumber =
      urlParams.get("phoneNumber") || urlParams.get("PhoneNumber");
    const service = urlParams.get("service");
    const message = urlParams.get("message") || urlParams.get("ResultDesc");

    // Map smartpaypesa status codes to our status
    let mappedStatus: PaymentStatus["status"] = "pending";

    if (status === "0" || status === "success" || status === "completed") {
      mappedStatus = "success";
    } else if (status === "1" || status === "failed" || status === "error") {
      mappedStatus = "failed";
    } else if (status === "cancelled" || status === "timeout") {
      mappedStatus = "cancelled";
    }

    const paymentData: PaymentStatus = {
      status: mappedStatus,
      transactionId: transactionId || undefined,
      amount: amount || undefined,
      phoneNumber: phoneNumber || undefined,
      service: service || undefined,
      message: message || undefined,
    };

    setPaymentStatus(paymentData);
    setLoading(false);

    // Store payment result in sessionStorage for potential use
    sessionStorage.setItem("lastPaymentResult", JSON.stringify(paymentData));
  }, [location]);

  const getStatusIcon = () => {
    if (!paymentStatus) return <Clock className="w-16 h-16" />;

    switch (paymentStatus.status) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "failed":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <Clock className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    if (!paymentStatus)
      return { title: "Processing...", subtitle: "Please wait" };

    switch (paymentStatus.status) {
      case "success":
        return {
          title: "Payment Successful!",
          subtitle: "Your payment has been processed successfully",
        };
      case "failed":
        return {
          title: "Payment Failed",
          subtitle:
            paymentStatus.message || "Your payment could not be processed",
        };
      case "cancelled":
        return {
          title: "Payment Cancelled",
          subtitle: "The payment was cancelled by user or timed out",
        };
      default:
        return {
          title: "Payment Pending",
          subtitle: "Your payment is being processed",
        };
    }
  };

  const getStatusColor = () => {
    if (!paymentStatus) return "text-hacker-green";

    switch (paymentStatus.status) {
      case "success":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "cancelled":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hacker-bg text-hacker-green relative overflow-hidden flex items-center justify-center">
        <MatrixRain />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-hacker-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-tech text-hacker-green-bright">
            Processing payment response...
          </p>
        </div>
      </div>
    );
  }

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative overflow-hidden">
      <MatrixRain />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-tech font-bold glow-text mb-4">
            PAYMENT STATUS
          </h1>
          <p className="text-hacker-green-bright font-tech">
            // ANONYMIKETECH Payment Gateway //
          </p>
        </motion.div>

        {/* Payment Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glow-border rounded-lg p-8 bg-hacker-terminal/30 backdrop-blur-sm text-center">
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              {getStatusIcon()}
            </motion.div>

            {/* Status Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-3xl font-tech font-bold mb-4 ${getStatusColor()}`}
            >
              {statusMessage.title}
            </motion.h2>

            {/* Status Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-hacker-green-dim font-tech mb-8"
            >
              {statusMessage.subtitle}
            </motion.p>

            {/* Payment Details */}
            {paymentStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-hacker-bg/50 rounded-lg p-6 mb-8 text-left space-y-3"
              >
                <h3 className="font-tech text-hacker-green-bright text-lg mb-4 text-center">
                  Transaction Details
                </h3>

                {paymentStatus.transactionId && (
                  <div className="flex justify-between items-center border-b border-hacker-green/20 pb-2">
                    <span className="font-tech text-hacker-green-dim">
                      Transaction ID:
                    </span>
                    <span className="font-tech text-hacker-green font-mono text-sm">
                      {paymentStatus.transactionId}
                    </span>
                  </div>
                )}

                {paymentStatus.amount && (
                  <div className="flex justify-between items-center border-b border-hacker-green/20 pb-2">
                    <span className="font-tech text-hacker-green-dim">
                      Amount:
                    </span>
                    <span className="font-tech text-hacker-green-bright">
                      KES {paymentStatus.amount}
                    </span>
                  </div>
                )}

                {paymentStatus.phoneNumber && (
                  <div className="flex justify-between items-center border-b border-hacker-green/20 pb-2">
                    <span className="font-tech text-hacker-green-dim">
                      Phone Number:
                    </span>
                    <span className="font-tech text-hacker-green">
                      {paymentStatus.phoneNumber}
                    </span>
                  </div>
                )}

                {paymentStatus.service && (
                  <div className="flex justify-between items-center border-b border-hacker-green/20 pb-2">
                    <span className="font-tech text-hacker-green-dim">
                      Service:
                    </span>
                    <span className="font-tech text-hacker-green-bright">
                      {paymentStatus.service}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              {paymentStatus?.status === "success" && (
                <div className="text-center mb-4">
                  <p className="font-tech text-green-500 mb-2">
                    ✅ Service will be activated within 5-10 minutes
                  </p>
                  <p className="font-tech text-hacker-green-dim text-sm">
                    You will receive confirmation via WhatsApp
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 bg-hacker-green text-hacker-bg px-6 py-3 rounded-lg font-tech font-bold hover:bg-hacker-green-bright transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </button>

                {paymentStatus?.status === "failed" && (
                  <button
                    onClick={() => window.history.back()}
                    className="bg-hacker-terminal border border-hacker-green text-hacker-green px-6 py-3 rounded-lg font-tech font-bold hover:bg-hacker-green hover:text-hacker-bg transition-all duration-300"
                  >
                    Try Again
                  </button>
                )}

                {paymentStatus?.status === "success" && (
                  <a
                    href="https://wa.me/+254113313240"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-tech font-bold hover:bg-green-700 transition-all duration-300"
                  >
                    💬 Contact Support
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8"
        >
          <p className="font-tech text-hacker-green-dim text-sm">
            For any payment issues, contact us on WhatsApp: +254 113 313 240
          </p>
        </motion.div>
      </div>
    </div>
  );
}
