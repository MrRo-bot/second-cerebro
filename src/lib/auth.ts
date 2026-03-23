import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { mongoClientPromise } from "@/lib/mongodb.server";

export const auth = betterAuth({
  //adding database and client promise to better auth
  database: mongodbAdapter(
    await mongoClientPromise.then((c) => c.db("second-cerebro")),
    {
      client: await mongoClientPromise,
    },
  ),

  //debug mode on
  debug: true,

  //defining one change to default field and adding additional field
  user: {
    modelName: "users",
    fields: {
      name: "fullName",
    },
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  //normal email pass auth flow
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, //later in production
  },

  //one click social auth provider (using google only as of now)
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      //test by removing it first to check if cloud options are working
      redirectURI:
        process.env.NODE_ENV === "production"
          ? "https://second-cerebro.vercel.app/api/auth/callback/google"
          : "http://localhost:3000/api/auth/callback/google",

      //some profile details added to it
      mapProfileToUser: (profile) => ({
        fullName: profile.name,
        username: profile.email.split("@")[0],
      }),
    },
  },

  // this makes Set-Cookie work in Server Actions & server flows
  plugins: [nextCookies()],

  // strict origin issues in development env
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production",
    disableCSRFCheck: process.env.NODE_ENV !== "production",
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
  },

  // strict origins
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://second-cerebro.vercel.app",
  ],
});
