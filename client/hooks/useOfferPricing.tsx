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

  useEffect(() => {
    const checkOfferStatus = () => {
      // Get current time in Nairobi, Kenya (UTC+3)
      const nairobiTime = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi"
      });
      const now = new Date(nairobiTime);
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours();

      // Offer active during:
      // - All day Saturday and Sunday (weekends)
      // - Monday-Friday between 6 PM and 10 PM
      const offerActive = (
        currentDay === 6 || // Saturday
        currentDay === 0 || // Sunday  
        (currentDay >= 1 && currentDay <= 5 && currentHour >= 18 && currentHour < 22) // Weekdays 6-10 PM
      );

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
    return plans.map(plan => ({
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
