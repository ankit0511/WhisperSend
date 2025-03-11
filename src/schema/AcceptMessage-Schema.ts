import { z } from "zod";

export const AcceptMessageSchemaVerification = z.object({
           acceptMessages : z.boolean()
})