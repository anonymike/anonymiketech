import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: Date;
  onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // If no target date provided, set default based on current time
    let endTime = targetDate;

    if (!endTime) {
      // Get current time in Nairobi, Kenya (UTC+3)
      const nairobiTime = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi"
      });
      const now = new Date(nairobiTime);
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours();

      // Weekend offer (all day Saturday and Sunday)
      if (currentDay === 6) {
        // Saturday - countdown to end of Sunday (Monday 12 AM)
        endTime = new Date(now);
        endTime.setDate(now.getDate() + 2); // Monday
        endTime.setHours(0, 0, 0, 0);
      } else if (currentDay === 0) {
        // Sunday - countdown to Monday 12 AM
        endTime = new Date(now);
        endTime.setDate(now.getDate() + 1); // Monday
        endTime.setHours(0, 0, 0, 0);
      }
      // Weekday offers (Monday-Friday 6 PM to 10 PM)
      else {
        if (currentHour >= 18 && currentHour < 22) {
          // Currently in offer window (6 PM - 10 PM) - countdown to 10 PM today
          endTime = new Date(now);
          endTime.setHours(22, 0, 0, 0);
        } else if (currentHour < 18) {
          // Before 6 PM - countdown to 6 PM today
          endTime = new Date(now);
          endTime.setHours(18, 0, 0, 0);
        } else {
          // After 10 PM - countdown to 6 PM tomorrow
          endTime = new Date(now);
          endTime.setDate(now.getDate() + 1);
          endTime.setHours(18, 0, 0, 0);
        }
      }
    }

    const timer = setInterval(() => {
      // Get current Nairobi time for calculations
      const nairobiNow = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi"
      });
      const now = new Date(nairobiNow).getTime();
      const distance = endTime!.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  // Check if we should show countdown (weekends and daily 6-10 PM)
  const shouldShowCountdown = () => {
    // Get current time in Nairobi, Kenya (UTC+3)
    const nairobiTime = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Nairobi"
    });
    const now = new Date(nairobiTime);
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    // Show during:
    // - All day Saturday and Sunday (weekends)
    // - Monday-Friday between 6 PM and 10 PM
    return (
      currentDay === 6 || // Saturday
      currentDay === 0 || // Sunday
      (currentDay >= 1 && currentDay <= 5 && currentHour >= 18 && currentHour < 22) || // Weekdays 6-10 PM
      targetDate // Always show if custom target date is provided
    );
  };

  if (!shouldShowCountdown() || isExpired) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-lg p-6 border border-red-500/30 mb-6"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-6 h-6 text-red-400" />
        </motion.div>
        <h3 className="text-xl font-tech font-bold text-red-400 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          LIMITED TIME OFFER!
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <motion.div
            key={unit}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: unit === 'seconds' ? [1, 1.1, 1] : 1,
                textShadow: [
                  "0 0 5px #ff0000",
                  "0 0 15px #ff0000", 
                  "0 0 5px #ff0000"
                ]
              }}
              transition={{ 
                scale: { duration: 1, repeat: Infinity },
                textShadow: { duration: 1.5, repeat: Infinity }
              }}
              className="bg-hacker-terminal border border-red-500/50 rounded-lg p-3 mb-2"
            >
              <div className="text-2xl md:text-3xl font-tech font-bold text-red-400">
                {value.toString().padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs font-tech text-red-300 uppercase tracking-wider">
              {unit}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center"
      >
        <p className="text-red-200 font-tech text-sm">
          ⚡ Don't miss out! Special offers every day 6-10 PM & all weekends! ⚡
        </p>
        <p className="text-red-300 font-tech text-xs mt-1 opacity-75">
          🕐 Times shown in Nairobi, Kenya timezone (EAT)
        </p>
      </motion.div>
    </motion.div>
  );
}
