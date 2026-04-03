import React, { useState } from "react";
import { UserIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { updateUser } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";

import { Accounts, SessionType } from "@/types/user";

const FullName = ({
  mySession,
  userAccount,
}: {
  mySession: SessionType;
  userAccount: Accounts | undefined;
}) => {
  const [name, setName] = useState(mySession?.user?.name);
  const [namePending, setNamePending] = useState(false);

  const handleUpdateName = async (name: string) => {
    setNamePending(true);
    try {
      if (name) {
        await updateUser({
          name,
        });

        renderToast({
          status: "success",
          message: "Name updated successfully",
        });
      }
    } catch (error) {
      console.error("ERROR_UPDATING_NAME" + error);
      renderToast({
        status: "error",
        //@ts-expect-error message:string
        message: error.message || "Failed to change name",
      });
    } finally {
      setNamePending(false);
    }
  };

  return (
    <InputGroup
      className={`max-w-xs mx-auto ${userAccount?.providerId !== "credential" ? "pointer-events-none blur-[1px]" : ""}`}
    >
      <InputGroupInput
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && name) handleUpdateName(name);
        }}
        placeholder="Name"
      />
      <InputGroupAddon>
        <UserIcon weight="bold" className="size-4" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {!namePending ? mySession?.user?.name : ""}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default FullName;
