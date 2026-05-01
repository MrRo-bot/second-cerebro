import { WarningOctagonIcon } from "@phosphor-icons/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FormErrorAlert = ({
  status,
  title,
  description,
}: {
  status: string;
  title: string;
  description: string[];
}) => {
  return (
    <Alert
      className={`w-max! rounded-lg mx-auto p-1 ${status === "error" && "bg-red-50 dark:bg-red-950/40"}`}
    >
      <WarningOctagonIcon weight="bold" className="size-4" />
      <AlertTitle className="tracking-wider">{title}</AlertTitle>
      <AlertDescription className="font-main font-semibold text-sm">
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
