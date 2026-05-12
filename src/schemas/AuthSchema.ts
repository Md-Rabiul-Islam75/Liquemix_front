import { z } from "zod";

// Regular expressions for validation
const nameRegex = /^[A-Za-z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// validation schema for registration
export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(25, "First name cannot exceed 25 characters")
    .regex(nameRegex, "Only letters allowed"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(25, "Last name cannot exceed 25 characters")
    .regex(nameRegex, "Only letters allowed"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

// validation schema for login
export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
