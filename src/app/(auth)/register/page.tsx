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
  gsap.registerPlugin(useGSAP);

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
      <Form
        className="signin w-full bg-white/4 backdrop-blur-[48px] rounded-xl border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px] overflow-hidden"
        action={action}
      >
        <div className="flex flex-col items-center text-center pt-12 px-8 pb-5">
          <p className="text-3xl max-w-sm leading-[1.3] font-medium font-heading mb-2.5">
            Sign Up
          </p>
          <p className="text-base font-normal leading-[1.55] mb-1.5 text-neutral-200/40">
            Turn Your Knowledge Into Your Edge
          </p>
        </div>

        <div className="px-8">
          <div className="flex flex-col w-full">
            <FieldGroup>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-[1_1_0%] h-0.5 opacity-6 bg-white"></div>
                <p className="m-0 leading-normal text-white/50 font-heading text-xs font-medium whitespace-nowrap uppercase tracking-wider opacity-60">
                  Social login
                </p>
                <div className="flex-[1_1_0%] h-0.5 opacity-6 bg-white"></div>
              </div>
              {/* google button */}
              <GoogleSignInButton />
              <div className="flex items-center justify-center gap-4">
                <div className="flex-[1_1_0%] h-0.5 opacity-6 bg-white"></div>
                <p className="m-0 leading-normal text-white/50 font-heading text-xs font-medium whitespace-nowrap uppercase tracking-wider opacity-60">
                  Or
                </p>
                <div className="flex-[1_1_0%] h-0.5 opacity-6 bg-white"></div>
              </div>
              <Field>
                <FieldLabel className="sr-only hidden" htmlFor="name">
                  NAME:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                  id="name"
                  name="name"
                  placeholder="Full name"
                />
                {state?.errors?.name && (
                  <FormErrorAlert
                    status="error"
                    title="Validation Error"
                    description={state?.errors?.name}
                  />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="sr-only hidden">
                  Email:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
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
                <FieldLabel className="sr-only hidden" htmlFor="username">
                  USERNAME:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                />
                {state?.errors?.username && (
                  <FormErrorAlert
                    status="error"
                    title="Validation Error"
                    description={state?.errors?.username}
                  />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="sr-only hidden">
                  Password:
                </FieldLabel>
                <Input
                  className="rounded-lg text-base! hover:bg-white/10! focus-visible:bg-white/10! placeholder-gray-200/50! px-2! py-5!"
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
                    className="cursor-pointer mx-auto w-max! px-4! flex items-center justify-center gap-2 text-base rounded-full mt-5 bg-orange-600 text-white"
                    disabled={pending}
                  >
                    <CustomLoading className="scale-70" text="Signing up..." />
                  </Button>
                ) : (
                  <Button
                    className="cursor-pointer block text-base rounded-full w-max! mx-auto px-4! mt-5 text-white bg-[rgb(255,75,20)] hover:shadow-[-1.3px_-1.3px_2.6px_0px_white,2.6px_2.6px_9.9px_0px_rgba(0,0,0,0.25)] hover:inset-shadow-[2.5px_2.5px_2.5px_0px_rgba(255,255,255,0.4)] transition-all duration-150 ease"
                    disabled={pending}
                  >
                    Sign Up
                  </Button>
                )}
              </Field>
              <FieldDescription className="text-center text-primary/50 my-6 text-base flex items-center  justify-center gap-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-200! hover:text-blue-400! no-underline! hover:underline! text-sm transition-all duration-200 ease-in-out"
                >
                  LOG IN
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignupForm;
