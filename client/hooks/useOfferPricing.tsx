import { useState, useEffect } from "react";

interface PricingData {
  regular: string;
  offer: string;
}

interface VPNPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const PRICING_CONFIG: Record<string, PricingData> = {
  "trial-plan": {
    regular: "KES 50",
    offer: "KES 50",
  },
  "weekly-plan": {
    regular: "KES 100",
    offer: "KES 80",
  },
  "two-weeks-plan": {
    regular: "KES 180",
    offer: "KES 160",
  },
  "three-weeks-plan": {
    regular: "KES 260",
    offer: "KES 240",
  },
  "monthly-plan": {
    regular: "KES 340",
    offer: "KES 320",
  },
};

export function useOfferPricing() {
  const [isOfferActive, setIsOfferActive] = useState(false);

  // Maintenance mode - set to false to enable offers
  const MAINTENANCE_MODE = false;

  useEffect(() => {
    const checkOfferStatus = () => {
      // Get current time in Nairobi, Kenya (UTC+3)
      const nairobiTime = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi",
      });
      const now = new Date(nairobiTime);
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Convert current time to minutes for precise comparison
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const offerStartTime = 18 * 60; // 6:00 PM = 18:00 = 1080 minutes
      const offerEndTime = 21 * 60 + 30; // 9:30 PM = 21:30 = 1290 minutes

      // Offer active during:
      // - All day Saturday and Sunday (weekends)
      // - EVERY DAY between 6:00 PM and 9:30 PM (including weekdays)
      // BUT NOT during maintenance mode
      const offerActive =
        !MAINTENANCE_MODE &&
        (currentDay === 6 || // Saturday (all day)
          currentDay === 0 || // Sunday (all day)
          (currentTimeInMinutes >= offerStartTime &&
            currentTimeInMinutes < offerEndTime)); // Daily 6:00 PM - 9:30 PM

      setIsOfferActive(offerActive);
    };

    // Check immediately
    checkOfferStatus();

    // Check every minute for real-time updates
    const interval = setInterval(checkOfferStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const getPriceForPlan = (planId: string): string => {
    const pricing = PRICING_CONFIG[planId];
    if (!pricing) return "KES 0";

    return isOfferActive ? pricing.offer : pricing.regular;
  };

  const getOriginalPrice = (planId: string): string => {
    const pricing = PRICING_CONFIG[planId];
    return pricing ? pricing.regular : "KES 0";
  };

  const hasDiscount = (planId: string): boolean => {
    const pricing = PRICING_CONFIG[planId];
    return pricing ? isOfferActive && pricing.offer !== pricing.regular : false;
  };

  const updateVPNPlansWithPricing = (plans: VPNPlan[]): VPNPlan[] => {
    return plans.map((plan) => ({
      ...plan,
      price: getPriceForPlan(plan.id),
    }));
  };

  return {
    isOfferActive,
    getPriceForPlan,
    getOriginalPrice,
    hasDiscount,
    updateVPNPlansWithPricing,
  };
}
