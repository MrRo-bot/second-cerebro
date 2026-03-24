import { RefObject } from "react";
import { Button } from "@/components/ui/button";

const CancelButton = ({ ref }: { ref: RefObject<HTMLFormElement | null> }) => {
  return (
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
