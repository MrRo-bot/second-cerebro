"use client";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import GoogleSignInButton from "@/components/buttons/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerBallIcon } from "@phosphor-icons/react";
import FormErrorAlert from "@/components/FormErrorAlert";

import { renderToast } from "@/lib/utils";

import { signupAction } from "@/actions/auth.action";

const SignupForm = () => {
  const [state, action, pending] = useActionState(signupAction, undefined);

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
        className="size-max mx-auto flex flex-col items-between gap-3"
        action={action}
      >
        <h2 className="text-center my-2">SIGN UP</h2>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="name">
            NAME:
          </Label>
          <Input id="name" name="name" placeholder="E.g. John Doe" />
          {state?.errors?.name && (
            <div className="col-start-2">
              <FormErrorAlert
                status="error"
                title="Validation Error"
                description={state?.errors?.name}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="email">
            EMAIL:
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
          <Label className="text-xl" htmlFor="username">
            USERNAME:
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="admin123"
          />
          {state?.errors?.username && (
            <div className="col-start-2">
              <FormErrorAlert
                status="error"
                title="Validation Error"
                description={state?.errors?.username}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="password">
            PASSWORD:
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
            <SpinnerBallIcon
              weight="bold"
              className="size-4 animate-spin origin-center "
            />{" "}
            Signing up...
          </Button>
        ) : (
          <Button
            className="cursor-pointer mx-auto w-max block"
            variant="destructive"
            disabled={pending}
          >
            Sign up
          </Button>
        )}
      </Form>
      <p className="text-center font-bold font-heading my-4">OR</p>

      <GoogleSignInButton />

      <p className="text-center text-red-400 my-6">
        Dont have an account?{" "}
        <Link href="/login" className="text-blue-600">
          SIGN IN
        </Link>
      </p>
    </>
  );
};

export default SignupForm;
