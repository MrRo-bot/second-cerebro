"use client";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import GoogleSignInButton from "@/components/buttons/GoogleAuthButton";
import FormErrorAlert from "@/components/FormErrorAlert";
import CustomLoading from "@/components/CustomLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  useGSAP(() => {
    gsap.from(".signin", {
      duration: 0.6,
      opacity: 0,
      y: 30,
      ease: "power4.out",
      delay: 0.1,
    });
  });

  return (
    <div className="max-w-lg flex flex-col items-center w-full px-6">
      <div className="flex flex-col items-center text-center pt-12 px-8 pb-5">
        <p className="text-3xl max-w-sm leading-[1.3] font-medium font-heading mb-2.5 text-white/70 dark:text-white">
          Join Second Cerebro
        </p>
        <p className="text-base font-normal leading-[1.55] mb-1.5 text-neutral-200/60 dark:text-neutral-200/40">
          Turn your knowledge into your edge
        </p>
      </div>
      <Form
        className="signin w-10/12 py-4 px-5 bg-white/30 dark:bg-white/4 backdrop-blur-[48px] rounded-lg border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px] overflow-hidden"
        action={action}
      >
        <FieldGroup className="gap-2">
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel className="sr-only hidden" htmlFor="name">
                NAME:
              </FieldLabel>
              <Input
                className="rounded-lg text-base! text-white/90 dark:text-white hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                id="name"
                name="name"
                placeholder="Full name"
              />
              {state?.errors?.name && (
                <FormErrorAlert
                  status="error"
                  description={state?.errors?.name}
                />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="sr-only hidden">
                Email:
              </FieldLabel>
              <Input
                className="rounded-lg text-base! text-white/90 dark:text-white hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
              />
              {state?.errors?.email && (
                <FormErrorAlert
                  status="error"
                  description={state?.errors?.email}
                />
              )}
            </Field>

            <Field>
              <FieldLabel className="sr-only hidden" htmlFor="username">
                USERNAME:
              </FieldLabel>
              <Input
                className="rounded-lg text-base! text-white/90 dark:text-white hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                id="username"
                name="username"
                type="text"
                placeholder="Username"
              />
              {state?.errors?.username && (
                <FormErrorAlert
                  status="error"
                  description={state?.errors?.username}
                />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="sr-only hidden">
                Password:
              </FieldLabel>
              <Input
                className="rounded-lg text-base! text-white/90 dark:text-white hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
              {state?.errors?.password && (
                <FormErrorAlert
                  status="error"
                  description={state?.errors?.password}
                />
              )}
            </Field>
          </div>
          <Field className="mt-6!">
            {pending ? (
              <Button
                className="cursor-pointer flex px-3! py-5! items-center justify-center gap-2 text-base rounded-full bg-orange-600 text-white"
                disabled={pending}
              >
                <CustomLoading className="scale-70" text="Signing up..." />
              </Button>
            ) : (
              <Button
                className="cursor-pointer text-base block h-10 rounded-full text-white bg-[rgb(255,75,20)] hover:shadow-[-1.3px_-1.3px_2.6px_0px_white,2.6px_2.6px_9.9px_0px_rgba(0,0,0,0.25)] hover:inset-shadow-[2.5px_2.5px_2.5px_0px_rgba(255,255,255,0.4)] transition-all duration-150 ease"
                disabled={pending}
              >
                Create Account
              </Button>
            )}
          </Field>

          <div className="h-px opacity-20 bg-white my-2"></div>

          {/* google button */}
          <GoogleSignInButton />

          <FieldDescription className="text-center text-primary/70 dark:text-primary/50 text-base flex items-center justify-center gap-2 mt-4!">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[rgb(255,181,158)] hover:text-[rgb(255,205,189)] text-sm no-underline! hover:underline! transition-all duration-200 ease-in-out"
            >
              Log In
            </Link>
          </FieldDescription>
        </FieldGroup>
      </Form>
    </div>
  );
};

export default SignupForm;
