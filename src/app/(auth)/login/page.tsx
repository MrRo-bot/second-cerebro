"use client";

import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import GoogleSignInButton from "@/components/buttons/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorAlert from "@/components/FormErrorAlert";
import CustomLoading from "@/components/CustomLoading";

import { renderToast } from "@/lib/utils";

import { signinAction } from "@/actions/auth.action";

const SigninForm = () => {
  const [state, action, pending] = useActionState(signinAction, undefined);

  useEffect(() => {
    if (state?.message)
      renderToast({
        status: state?.status,
        message: state?.message,
      });
  }, [state]);

  return (
    <>
      <Form
        className="size-max flex flex-col items-between gap-3 w-max"
        action={action}
      >
        <h2 className="text-center my-2">SIGN IN</h2>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="email">
            Email:
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
          />
          {state?.errors?.email && (
            <div className="col-start-2">
              <FormErrorAlert
                status="error"
                title="Validation Error"
                description={state?.errors?.email}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="password">
            Password:
          </Label>
          <Input id="password" name="password" type="password" />
          {state?.errors?.password && (
            <div className="col-start-2">
              <FormErrorAlert
                status="error"
                title="Validation Error"
                description={state?.errors?.password}
              />
            </div>
          )}
        </div>

        {pending ? (
          <Button
            className="cursor-pointer mx-auto w-max flex items-center justify-center gap-2"
            variant="destructive"
            disabled={pending}
          >
            <CustomLoading className="scale-70" text="Signing in..." />
          </Button>
        ) : (
          <Button
            className="cursor-pointer mx-auto w-max block"
            variant="destructive"
            disabled={pending}
          >
            Sign In
          </Button>
        )}
      </Form>
      <p className="text-center font-bold font-heading my-4">OR</p>
      <GoogleSignInButton />
      <p className="text-center text-red-400 my-6">
        Dont have an account?{" "}
        <Link href="/register" className="text-blue-600">
          SIGN UP
        </Link>
      </p>
    </>
  );
};

export default SigninForm;
