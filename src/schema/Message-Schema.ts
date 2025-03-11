import { z } from "zod";

export const messageSchemaVerification = z.object({
           messageContent : z.string()
                             .min(4, { message: "Message must be at least 3 characters long" })
                             .max(300, { message: "Message cannot exceed 300 characters" })
})