import { useState } from "react";
import { PasswordIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import CustomLoading from "@/components/CustomLoading";

import { changePassword } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";

const Password = () => {
  const [passPending, setPassPending] = useState(false);
  const [passChange, setPassChange] = useState<{
    currPass: string;
    newPass: string;
  }>({
    currPass: "",
    newPass: "",
  });

  const handleUpdatePass = async () => {
    setPassPending(true);
    try {
      await changePassword({
        currentPassword: passChange.currPass,
        newPassword: passChange.newPass,
        revokeOtherSessions: true,
      });

      renderToast({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("ERROR_UPDATING_PASSWORD" + error);
      renderToast({
        status: "error",
        //@ts-expect-error message:string
        message: error.message || "Failed to change password",
      });
    } finally {
      setPassPending(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroup className="max-w-xs mx-auto">
          <InputGroupText className="ml-2">Password</InputGroupText>
          <InputGroupAddon>
            <PasswordIcon weight="bold" className="size-4" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="ml-auto">
            ********
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium font-heading">
              Change Password
            </h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                autoComplete="new-password"
                type="password"
                id="currentPassword"
                value={passChange.currPass}
                onChange={(e) =>
                  setPassChange((prev) => ({
                    ...prev,
                    currPass: e.target.value,
                  }))
                }
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                value={passChange.newPass}
                onChange={(e) =>
                  setPassChange((prev) => ({
                    ...prev,
                    newPass: e.target.value,
                  }))
                }
                className="col-span-2 h-8"
              />
            </div>
            <Separator />

            {passPending ? (
              <Button
                className="cursor-pointer mx-auto w-max flex items-center justify-center gap-2"
                variant="destructive"
                disabled={passPending}
              >
                <CustomLoading
                  className="scale-70"
                  text="Changing Password..."
                />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                className="w-max mx-auto cursor-pointer"
                onClick={handleUpdatePass}
              >
                Set Password
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Password;
