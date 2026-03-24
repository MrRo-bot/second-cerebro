"use client";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";

import { signupAction } from "@/actions/auth.action";
import GoogleSignInButton from "@/components/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignupForm = () => {
  const [state, action, pending] = useActionState(signupAction, undefined);

  return (
    <Form className="flex flex-col items-between gap-3" action={action}>
      <h2 className="text-center my-2">SIGN UP</h2>
      <div className="grid grid-cols-[1fr_3fr] gap-4">
        <Label className="text-xl" htmlFor="fullName">
          Full NAME:
        </Label>
        <Input id="fullName" name="fullName" placeholder="E.g. John Doe" />
        {state?.errors?.fullName && <p>{state.errors.fullName}</p>}
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
        {state?.errors?.email && <p>{state.errors.email}</p>}
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
        {state?.errors?.username && <p>{state.errors.username}</p>}
      </div>
      <div className="grid grid-cols-[1fr_3fr] gap-4">
        <Label className="text-xl" htmlFor="password">
          PASSWORD:
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
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <Button
        className="cursor-pointer mx-auto w-max block"
        variant="destructive"
        disabled={pending}
      >
        {pending ? "Signing up..." : "Sign Up"}
      </Button>

      <p className="text-center font-bold font-heading">OR</p>

      <GoogleSignInButton />

      <p className="text-center text-red-400 my-6">
        Dont have an account?{" "}
        <Link href="/login" className="text-blue-600">
          SIGN IN
        </Link>
      </p>
    </Form>
  );
};

export default SignupForm;
