import { z } from "zod";

export const SignupFormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirm_password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    first_name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    last_name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Chỉ chỉ lỗi cho trường confirm_password
  });

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
        confirm_password?: string[];
        first_name?: string[];
        last_name?: string[];
      };
      message?: string;
    }
  | undefined;
