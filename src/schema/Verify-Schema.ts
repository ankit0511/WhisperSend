import { z } from "zod";

export const verifySchema = z.string()
                             .min(6, { message: "Verification Code must be at least 6 characters long" })