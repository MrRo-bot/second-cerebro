import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { ObjectId } from "mongodb";

import { mongoClientPromise } from "@/lib/mongodb.server";
import { notes } from "@/lib/collections";
import { G_CLIENT_ID, G_CLIENT_SECRET, PUBLIC_AUTH_URL } from "@/lib/constants";

export const auth = betterAuth({
  // adding database and client promise to better auth
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
  // secret: process.env.BETTER_AUTH_SECRET,

  // debug mode on
  debug: true,

  // defining one change to default field and adding additional field
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
        type: "string", // Store as a JSON string or object depending on DB setup
        required: false,
      },
    },
    deleteUser: {
      enabled: true,
      // Requires the user to provide a password for the delete call
      requirePassword: true,
      // It's better so I can get userId to delete notes with the id after user confirms account deletion
      beforeDelete: async (user) => {
        try {
          await notes.deleteMany({
            userId: new ObjectId(user.id),
          });

          console.log(`Successfully deleted notes for user: ${user.id}`);
        } catch (e) {
          console.error("Failed to delete user notes:", e);
          // Throwing an error to prevent the user deletion flow
          throw new Error("Could not clean up user data. Deletion aborted");
        }
      },
    },
  },

  // normal email pass auth flow
  emailAndPassword: {
    enabled: true,
    // TODO: requireEmailVerification: true, REQUIRES BETTER AUTH EMAIL VERIFICATION SERVICE I THINK
  },

  session: {
    // How long the session lasts if the user is COMPLETELY inactive
    expiresIn: 60 * 60 * 24 * 30, // 30 Days (for my needs)

    // How often to "reset" the expiration timer in the DB
    // If user starts the app today, their 30-day clock starts over.
    updateAge: 60 * 60 * 24, // 1 Day

    // How long before a "Fresh" check is required for sensitive actions
    // (e.g., deleting a workspace or exporting all notes)
    freshAge: 60 * 60, // 1 Hour
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Caching session in memory/cookie for 5 mins
    },
  },

  // one click social auth provider (using google as of now)
  socialProviders: {
    google: {
      enabled: true,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      scope: ["https://www.googleapis.com/auth/userinfo.profile", "openid"],
      accessType: "offline",
      prompt: "consent", // Forces Google to show the consent screen to provide the refresh token

      // test by removing it first to check if cloud options are working
      // Better Auth 1.1+ can often infer this, but explicit is safer
      redirectURI:
        process.env.NODE_ENV === "production"
          ? "https://second-cerebro.vercel.app/api/auth/callback/google"
          : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,

      // some profile details added to it
      mapProfileToUser: (profile) => ({
        name: profile.name,
        // Consider adding a random suffix for uniqueness
        username: `${profile.email.split("@")[0]}_${Math.floor(Math.random() * 1000)}`,
      }),
    },
  },

  // this makes Set-Cookie work in Server Actions & server flows
  plugins: [nextCookies()],

  // strict origin issues in development env
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
    // secure cookie in production but send in local env
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  // strict origins
  trustedOrigins: [
    PUBLIC_AUTH_URL || "http://localhost:3000",
    "https://second-cerebro.vercel.app",
  ],
});
