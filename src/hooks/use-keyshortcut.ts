import { RefObject, useEffect } from "react";

type ShortcutConfig = {
  ctrlOrMeta?: boolean;
  key: string;
  shift?: boolean;
};

const useKeyshortcut = (
  ref: RefObject<HTMLDivElement | null>,
  config: ShortcutConfig,
) => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isTyping = ["INPUT", "TEXTAREA"].includes(
        document.activeElement?.tagName || "",
      );
      if (isTyping) return;

      const targetKey = config.key.toLowerCase();
      const pressedKey = e.key.toLowerCase();

      const modifierMatch = config.ctrlOrMeta ? e.metaKey || e.ctrlKey : true;
      const shiftMatch = config.shift ? e.shiftKey : !e.shiftKey;

      if (modifierMatch && shiftMatch && pressedKey === targetKey) {
        e.preventDefault();
        ref.current?.click();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [ref, config]);
};

export default useKeyshortcut;
