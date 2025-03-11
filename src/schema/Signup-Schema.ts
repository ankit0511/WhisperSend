import { z } from "zod";

export const userNameVerification = z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username cannot exceed 20 characters")
        .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, underscores, dots, and hyphens")

export const userSingupVerifiction = z.object({
        userName: userNameVerification,
        email: z.string()
                .email({ message: "Invalid Email Address" }),
        password: z.string()
                   .min(4, { message: "Password must be at least 3 characters long" })
                   .max(20, { message: "Password cannot exceed 20 characters" })
   
})