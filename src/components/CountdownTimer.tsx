'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryDate: Date | string;
  taskTitle: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryDate, taskTitle }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const expiry = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (isExpired) {
    return (
      <div className="bg-red-500 text-white text-center py-4 rounded-lg mb-6">
        <p className="font-bold text-lg">This task has expired</p>
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-center py-4 rounded-lg mb-6">
      <p className="font-bold text-sm mb-2">Task Expires In:</p>
      <div className="flex justify-center gap-4 text-xl font-bold">
        <div>
          <span>{timeLeft.days}</span>
          <p className="text-xs">Days</p>
        </div>
        <div>
          <span>{timeLeft.hours}</span>
          <p className="text-xs">Hours</p>
        </div>
        <div>
          <span>{timeLeft.minutes}</span>
          <p className="text-xs">Minutes</p>
        </div>
        <div>
          <span>{timeLeft.seconds}</span>
          <p className="text-xs">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;