"use client";

import { useState, useEffect } from "react";
import { findEmoji } from "@/lib/constants";

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

  const emoji = findEmoji(+time.slice(0, 2));

  return (
    <span
      //todo: toast ui testing
      // onClick={() => {
      //   return renderToast({
      //     status: "success",
      //     message: "testing",
      //     opts: {
      //       duration: 50000,
      //     },
      //   });
      // }}
      className={`${emoji.color} flex gap-1 items-center justify-between shadow-md px-4 py-2 rounded-lg min-w-36`}
    >
      <span className="font-heading block">{time}</span>
      <span className="block pt-0.5">{emoji.icon}</span>
    </span>
  );
};
export default Clock;
