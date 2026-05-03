import React, { useState } from "react";
import { CalendarHeartIcon } from "@phosphor-icons/react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { updateUser } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";

import { SessionObjectType } from "@/types/user";

const DateOfBirth = ({ mySession }: { mySession: SessionObjectType }) => {
  const [date, setDate] = useState<Date | undefined>(
    mySession?.user?.dateOfBirth || new Date(),
  );
  const [datePending, setDatePending] = useState(false);

  const handleUpdateDob = async (dateOfBirth: Date | undefined) => {
    setDatePending(true);
    try {
      if (dateOfBirth) {
        await updateUser({
          dateOfBirth,
        });

        renderToast({
          status: "success",
          message: "Birthdate updated",
        });
      }
    } catch (error) {
      console.error("ERROR_UPDATING_DATE" + error);
      renderToast({
        status: "error",
        //@ts-expect-error message:string
        message: error.message || "Failed to change Birth date",
      });
    } finally {
      setDatePending(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroup className="max-w-xs mx-auto rounded-xl">
          <InputGroupText className="ml-2">Date of birth</InputGroupText>
          <InputGroupAddon>
            <CalendarHeartIcon weight="bold" className="size-4" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="ml-auto">
            {!datePending && date ? format(date, "dd-MM-yyyy") : ""}
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent className="rounded-md w-max h-max">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => (setDate(e), handleUpdateDob(e))}
          startMonth={new Date(1940, 0)}
          className="rounded-lg border bg-accent"
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateOfBirth;
