import { useEffect, useState } from "react";
import { AtIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { updateUser } from "@/lib/auth-client";
import { runUpdate } from "@/lib/utils";

import { SessionObjectType } from "@/types/user";

const Username = ({ mySession }: { mySession: SessionObjectType }) => {
  const sessionUsername =mySession?.user?.username ?? ""
  const [username, setUsername] = useState(sessionUsername);
  const [userPending, setUserPending] = useState(false);

  useEffect(() => {
    setUsername(sessionUsername)
  }, [sessionUsername])
  
  const handleUpdateUsername = async (username: string) => {
    setUserPending(true);
    await runUpdate(()=>updateUser({username}),{
      success:'Username updated successfully',
      fallback:'Failed to update username',
    })
    setUserPending(false)
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
        {!userPending && mySession?.user?.username ? "@" + mySession.user.username : ""}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Username;
