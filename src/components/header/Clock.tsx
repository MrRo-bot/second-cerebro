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

  const findEmoji = (hours: number): { icon: string; color: string } => {
    switch (true) {
      case hours >= 4 && hours < 12:
        return { icon: "🌞", color: "shadow-amber-300/20" };
      case hours >= 12 && hours < 18:
        return { icon: "😎", color: "shadow-amber-400/20" };
      case hours >= 18 && hours < 21:
        return { icon: "🌓", color: "shadow-slate-600/20" };
      case (hours >= 21 && hours <= 23) || hours < 4:
        return { icon: "🌚", color: "shadow-slate-400/20" };
      default:
        return { icon: "☠️", color: "shadow-zinc-300/50" };
    }
  };

  const emoji = findEmoji(+time.slice(0, 2));

  return (
    <span
      className={`${emoji.color} flex gap-1 items-center justify-between shadow-md px-4 py-2 rounded-lg min-w-36`}
    >
      <span className="font-heading block">{time}</span>
      <span className="block pt-0.5">{emoji.icon}</span>
    </span>
  );
};
export default Clock;
