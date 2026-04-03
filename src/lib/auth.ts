import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { mongoClientPromise } from "@/lib/mongodb.server";

export const auth = betterAuth({
  //* adding database and client promise to better auth
  database: mongodbAdapter(
    await mongoClientPromise.then((c) => c.db("second-cerebro")),
    {
      client: await mongoClientPromise,
      //TODO: debugLogs:false,
      //TODO: transaction:true -> Whether to execute multiple operations in a transaction.
      // Recommendation: keeping this false unless converted MongoDB deployment into a Replica Set. Standard standalone MongoDB instances do not support multi-document transactions and will throw an error if this is enabled.
    },
  ),

  // TODO: Use a dedicated secret in production
  //* secret: process.env.BETTER_AUTH_SECRET,

  //* debug mode on
  debug: true,

  //* defining one change to default field and adding additional field
  user: {
    modelName: "users",
    fields: {
      name: "name",
    },
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
      dateOfBirth: {
        type: "date",
        required: false,
      },
      gender: {
        type: "string",
        required: false,
      },
      preferences: {
        type: "string", //* Store as a JSON string or object depending on DB setup
        required: false,
      },
    },
  },

  //* normal email pass auth flow
  emailAndPassword: {
    enabled: true,
    // TODO: requireEmailVerification: true, REQUIRES BETTER AUTH EMAIL VERIFICATION SERVICE I THINK
  },

  //* one click social auth provider (using google as of now)
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      //* test by removing it first to check if cloud options are working
      // Better Auth 1.1+ can often infer this, but explicit is safer
      redirectURI:
        process.env.NODE_ENV === "production"
          ? "https://second-cerebro.vercel.app/api/auth/callback/google"
          : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,

      //* some profile details added to it
      mapProfileToUser: (profile) => ({
        name: profile.name,
        //* Consider adding a random suffix for uniqueness
        username: `${profile.email.split("@")[0]}_${Math.floor(Math.random() * 1000)}`,
      }),
    },
  },

  //* this makes Set-Cookie work in Server Actions & server flows
  plugins: [nextCookies()],

  //* strict origin issues in development env
  // TODO:NEED TO CHECK WHAT IS SUITABLE FOR PRODUCTION ENV DEPENDING WHICH HOST FRONTEND AND BACKEND
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production",
    disableCSRFCheck: process.env.NODE_ENV !== "production",
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
    //* secure cookie in production but send in local env
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  //* strict origins
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    "https://second-cerebro.vercel.app",
  ],
});
