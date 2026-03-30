import * as z from "zod";

//* SIGN UP FORM SCHEMA
export const SignupFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long" })
    .trim(),

  email: z.email({ error: "Please enter a valid email" }).trim(),

  username: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),

  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter" })
    .regex(/[0-9]/, { error: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character",
    })
    .trim(),
});

//* SIGN IN FORM SCHEMA
export const SigninFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }).trim(),

  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter" })
    .regex(/[0-9]/, { error: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character",
    })
    .trim(),
});

//* NEW NOTE SCHEMA
export const NewNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters")
    .trim(),

  content: z
    .string()
    .min(1, "Your note cannot be empty")
    // 50,000 chars is a safe limit for most LLM context windows (approx 10k-12k tokens)
    .max(50000, "Note is too long for a single entry"),

  // TODO: If you want to categorize notes later
  // tags: z
  //   .array(z.string())
  //   .optional()
  //   .default([]),
});

//* SEARCH NOTE SCHEMA
export const SearchNoteSchema = z.object({
  queryString: z
    .string()
    .min(2, { error: "Search query can't be less than 2 characters" })
    .trim(),
});
