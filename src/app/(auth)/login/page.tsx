"use client";
import Form from "next/form";
import { useActionState } from "react";

import { signinAction } from "@/actions/auth.action";
import GoogleSignInButton from "@/components/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const SigninForm = () => {
  const [state, action, pending] = useActionState(signinAction, undefined);

  return (
    <>
      <Form className="flex flex-col items-between gap-3" action={action}>
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
          {state?.errors?.email && <p>{state.errors.email}</p>}
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="password">
            Password:
          </Label>
          <Input id="password" name="password" type="password" />
          {state?.errors?.password && (
            <div>
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
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
