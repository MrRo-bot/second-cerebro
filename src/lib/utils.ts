import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const renderToast = (args: {
  status?: string;
  message: string;
  position?: string;
}) => {
  const { status, message } = args;
  //TODO: EXPLORE TYPE FILE OF .SUCCESS TO GET MORE INFO ON SETTINGS
  switch (status) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
};
