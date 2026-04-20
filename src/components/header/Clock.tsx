"use client";

import { useState, useEffect } from "react";

const Clock = ({ timeZone = "Asia/Kolkata" }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const displayTime = new Date().toLocaleString("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(displayTime);
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [timeZone]);

  const emoji = (hours: number) => {
    switch (true) {
      case hours >= 4 && hours < 12:
        return "🌞";
      case hours >= 12 && hours < 18:
        return "😎";
      case hours >= 18 && hours < 21:
        return "🌕";
      case (hours >= 21 && hours <= 23) || hours < 4:
        return "🌚";
    }
  };

  return <span>{time && `${time} ${emoji(+time.slice(0, 2))}`}</span>;
};
export default Clock;
