"use client";

import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import GoogleSignInButton from "@/components/buttons/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormErrorAlert from "@/components/FormErrorAlert";
import CustomLoading from "@/components/CustomLoading";
import { Separator } from "@/components/ui/separator";

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
    <div className="max-w-lg flex flex-col items-center w-full px-6 z-20">
      <Form
        className="w-full bg-black/40 backdrop-blur-2xl rounded-3xl border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px] overflow-hidden"
        action={action}
      >
        <div className="flex flex-col items-center text-center pt-12 px-8 pb-5">
          <p className="text-3xl max-w-sm leading-[1.3] font-medium font-heading mb-2.5">
            Log in
          </p>
          <p className="text-base font-normal leading-[1.55] mb-1.5 text-neutral-200/80">
            Turn Your Knowledge Into Your Edge
          </p>
        </div>
        <div className="px-8">
          <div className="flex flex-col w-full">
            <FieldGroup>
              <Separator className="relative my-4">
                <span className="absolute bg-gray-700 px-3 left-1/2 -translate-x-1/2 -translate-y-2.5 backdrop-blur-xl uppercase text-sm text-white/50 rounded-sm">
                  Social Login
                </span>
              </Separator>
              {/* google button */}
              <GoogleSignInButton />
              <Separator className="relative my-4">
                <span className="absolute bg-gray-700 px-3 left-1/2 -translate-x-1/2 -translate-y-2.5 backdrop-blur-xl uppercase text-sm text-white/50 rounded-sm">
                  Or
                </span>
              </Separator>

              <Field>
                <FieldLabel htmlFor="email" className="sr-only hidden">
                  Email:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! placeholder-gray-200/50! px-2! py-5!"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                />
                {state?.errors?.email && (
                  <FormErrorAlert
                    status="error"
                    title="Validation Error"
                    description={state?.errors?.email}
                  />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="sr-only hidden">
                  Password:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! placeholder-gray-200/50! px-2! py-5!"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                {state?.errors?.password && (
                  <FormErrorAlert
                    status="error"
                    title="Validation Error"
                    description={state?.errors?.password}
                  />
                )}
              </Field>

              <Field>
                {pending ? (
                  <Button
                    className="cursor-pointer mx-auto w-max flex items-center justify-center gap-2 text-base rounded-full mt-5 bg-orange-600 text-white"
                    disabled={pending}
                  >
                    <CustomLoading className="scale-70" text="Signing in..." />
                  </Button>
                ) : (
                  <Button
                    className="cursor-pointer block text-base rounded-full mt-5 bg-orange-600 text-white"
                    disabled={pending}
                  >
                    Log in
                  </Button>
                )}
              </Field>
              <FieldDescription className="text-center text-primary/50 my-6 text-base flex items-center  justify-center gap-1">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-200 text-sm">
                  SIGN UP
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SigninForm;
