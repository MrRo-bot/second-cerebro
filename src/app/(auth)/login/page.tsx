"use client";

import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import GoogleSignInButton from "@/components/buttons/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signinAction } from "@/actions/auth.action";
import { renderToast } from "@/lib/utils";

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
            <p className="text-red-500 w-max col-start-2">
              {state.errors.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="password">
            Password:
          </Label>
          <Input id="password" name="password" type="password" />
          {state?.errors?.password && (
            <p className="text-red-500 w-max col-start-2">
              {state?.errors?.password}
            </p>
          )}
        </div>

        <Button
          className="cursor-pointer mx-auto w-max block"
          variant="destructive"
          disabled={pending}
        >
          {pending ? "Signing in..." : "Sign In"}
        </Button>
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
