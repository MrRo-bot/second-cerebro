import { useState } from "react";
import { GenderMaleIcon } from "@phosphor-icons/react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { updateUser } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";

import { SessionObjectType } from "@/types/user";

const Gender = ({ mySession }: { mySession: SessionObjectType }) => {
  const [gender, setGender] = useState(mySession?.user?.gender || "Male");
  const [genderPending, setGenderPending] = useState(false);

  const handleUpdateGender = async (gender: string) => {
    setGenderPending(true);
    try {
      if (gender) {
        await updateUser({
          gender,
        });

        renderToast({
          status: "success",
          message: "Gender updated",
        });
      }
    } catch (error) {
      console.error("ERROR_UPDATING_GENDER" + error);
      renderToast({
        status: "error",
        //@ts-expect-error message:string
        message: error.message || "Failed to change gender",
      });
    } finally {
      setGenderPending(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroup className="max-w-xs mx-auto rounded-xl">
          <InputGroupText className="ml-2">Gender</InputGroupText>
          <InputGroupAddon>
            <GenderMaleIcon weight="bold" className="size-4" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="ml-auto">
            {!genderPending ? gender : ""}
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent className="rounded-md w-max h-max">
        <RadioGroup
          value={gender}
          onValueChange={(val) => {
            setGender(val);
            handleUpdateGender(val);
          }}
          className="w-fit"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="Male" value="Male" />
            <Label htmlFor="Male">Male</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="Female" id="Female" />
            <Label htmlFor="Female">Female</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="Others" id="Others" />
            <Label htmlFor="Others">Others</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="Prefer Not To Say" id="PreferNotToSay" />
            <Label htmlFor="PreferNotToSay">Prefer Not To Say</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};

export default Gender;
