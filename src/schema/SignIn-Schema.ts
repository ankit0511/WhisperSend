import { z } from "zod";

export const signinSchemaVerification = z.object({
            userName:z.string(),
            password: z.string()
                   .min(4, { message: "Password must be at least 3 characters long" })
                   .max(20, { message: "Password cannot exceed 20 characters" })
})