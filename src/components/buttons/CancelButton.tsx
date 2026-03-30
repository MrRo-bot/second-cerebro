import { RefObject } from "react";
import { Button } from "@/components/ui/button";

const CancelButton = ({ ref }: { ref: RefObject<HTMLFormElement | null> }) => {
  return (
    // TODO: need more to it for not only clearing from form ref but other components like tiptap editor are involved
    <Button
      onClick={() => ref?.current?.reset()}
      type="button"
      className="cursor-pointer mx-auto w-max block"
      variant="ghost"
    >
      CANCEL
    </Button>
  );
};

export default CancelButton;
