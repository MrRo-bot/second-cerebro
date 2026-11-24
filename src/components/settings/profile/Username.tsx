import { useState } from "react";
import { AtIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { updateUser } from "@/lib/auth-client";
import { normalizeError, renderToast } from "@/lib/utils";

import { SessionObjectType } from "@/types/user";

const Username = ({ mySession }: { mySession: SessionObjectType }) => {
  const [username, setUsername] = useState(mySession?.user?.username);
  const [userPending, setUserPending] = useState(false);

  const handleUpdateUsername = async (username: string) => {
    setUserPending(true);
    try {
      await updateUser({
        username,
      });

      renderToast({
        status: "success",
        message: "Username updated successfully",
      });
    } catch (error) {
      console.error("Error updating username: ", JSON.stringify(error));
      const info = normalizeError(error);
      renderToast({
        status: "error" as const,
        message: info.message || "Failed to update username",
        ...(process.env.NODE_ENV !== "production" && { debug: info }),
      });
    } finally {
      setUserPending(false);
    }
  };

  return (
    <InputGroup className="max-w-xs mx-auto rounded-lg">
      <InputGroupInput
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && username) handleUpdateUsername(username);
        }}
        placeholder="Username"
      />
      <InputGroupAddon>
        <AtIcon weight="bold" className="size-4" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {!userPending ? "@" + mySession?.user?.username : ""}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Username;
