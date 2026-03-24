"use client";

import { useState } from "react";
import { SpinnerBallIcon } from "@phosphor-icons/react";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",

        // Optional extras:
        // scopes: ["email", "profile"], // default is fine
        // state: JSON.stringify({ from: "register" }), // to pass custom state (if needed)
      });
      // Note: this redirects automatically via window.location to Google's consent screen
    } catch (error) {
      // toast
      console.error("Google sign-in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-max mx-auto flex items-center gap-2 cursor-pointer"
    >
      {isLoading ? (
        <SpinnerBallIcon className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.46 3.09-7.25z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.77 20.39 7.01 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 7.01 0 2.77 2.61 0.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
            fill="#EA4335"
          />
        </svg>
      )}
      {isLoading ? "Connecting..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuthButton;
