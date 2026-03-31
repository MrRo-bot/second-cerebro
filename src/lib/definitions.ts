import * as z from "zod";

const emailSchema = z.email("Invalid email address").trim().toLowerCase();
const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^a-zA-Z0-9]/, "Include at least one special character")
  .trim();

//* SIGN UP FORM SCHEMA
export const SignupFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50).trim(),
  email: emailSchema,
  username: z
    .string()
    .min(3, "Username must be 3+ characters")
    .max(20, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only")
    .toLowerCase() // Standardize storage
    .trim(),
  password: passwordSchema,
});

//* SIGN IN FORM SCHEMA
export const SigninFormSchema = z.object({
  email: emailSchema,
  // Using relaxed password check for sign-in to avoid lockouts global password policies change.
  password: z.string().min(1, "Password is required"),
});

//* NEW NOTE SCHEMA
export const NewNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Keep titles concise")
    .trim(),
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(50000, "Note exceeds maximum character limit (50k)"),
  // TODO: Recommended: Add a visibility or status flag
  // status: z.enum(["draft", "published"]).default("published"),
});

//* SEARCH NOTE SCHEMA
export const SearchNoteSchema = z.object({
  queryString: z // renamed from queryString for cleaner URL params
    .string()
    .min(1, "Search cannot be empty")
    .max(100)
    .trim(),
});

export type SignupInput = z.infer<typeof SignupFormSchema>;
export type SigninInput = z.infer<typeof SigninFormSchema>;
export type NoteInput = z.infer<typeof NewNoteSchema>;
