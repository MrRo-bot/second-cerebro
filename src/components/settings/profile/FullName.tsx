import React, { useState } from "react";
import { UserIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { updateUser } from "@/lib/auth-client";
import { runUpdate } from "@/lib/utils";

import { AccountsType, SessionObjectType } from "@/types/user";

const FullName = ({
  mySession,
  userAccount,
}: {
  mySession: SessionObjectType;
  userAccount: AccountsType | undefined;
}) => {
  const [name, setName] = useState(mySession?.user?.name);
  const [namePending, setNamePending] = useState(false);

  const handleUpdateName = async (name: string) => {
    setNamePending(true);
    await runUpdate(() => updateUser({ name }), {
      success: "Name updated successfully",
      fallback: "Failed to update name",
    });
    setNamePending(false);
  };

  return (
    <InputGroup
      className={`max-w-xs mx-auto rounded-lg ${userAccount?.providerId !== "credential" ? "pointer-events-none blur-[1px]" : ""}`}
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
