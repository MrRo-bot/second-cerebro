import { WarningOctagonIcon } from "@phosphor-icons/react";

import { Alert, AlertDescription } from "@/components/ui/alert";

const FormErrorAlert = ({
  status,
  description,
}: {
  status: string;
  description: string[];
}) => {
  return (
    <Alert
      className={`w-max! rounded-lg px-2! py-1! mx-auto ${status === "error" && "bg-red-200 dark:bg-red-600/40"}`}
    >
      <WarningOctagonIcon weight="bold" className="size-4 mt-0.5" />
      <AlertDescription className="font-main mt-0.5 font-semibold text-xs">
        {description.length > 1 ? (
          <ul className="w-max list-none">
            {description.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : (
          description
        )}
      </AlertDescription>
    </Alert>
  );
};

export default FormErrorAlert;
