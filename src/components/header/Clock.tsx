"use client";

import { useState, useEffect } from "react";
import { findEmoji } from "@/lib/constants";
import { SpinnerBallIcon } from "@phosphor-icons/react";
import Loader2 from "../Loader2";
// import { renderToast } from "@/lib/utils";

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
      //     status: "error",
      //     message: "testing",
      //     opts: {
      //       duration: 50000,
      //     },
      //   });
      // }}
      className={`${emoji.color} shadow-md xs:px-4 xs:py-2 rounded-lg min-w-36`}
    >
      {time ? (
        <span className="flex items-center justify-between">
          <span className="font-heading block">{time}</span>
          <span className="block pt-0.5">{emoji.icon}</span>
        </span>
      ) : (
        <span className="flex gap-0.5 items-center justify-center">
          <Loader2 text='Loading'/>
          <SpinnerBallIcon
            weight="bold"
            className="size-4 animate-spin text-emerald-700 dark:text-emerald-400 transition-colors"
          />
        </span>
      )}
    </span>
  );
};
export default Clock;
