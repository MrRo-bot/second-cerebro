import { useState } from "react";
import { AtIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { updateUser } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";

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
      console.error("ERROR_UPDATING_USERNAME" + error);
      renderToast({
        status: "error",
        //@ts-expect-error message:string
        message: error.message || "Failed to change username",
      });
    } finally {
      setUserPending(false);
    }
  };

  return (
    <InputGroup className="max-w-xs mx-auto">
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
