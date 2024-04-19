import { z } from 'zod';

const userQuerySchema = z.object({
    accountType: z.array(z.string()).optional(),
    accountStatus: z.array(z.string()).optional(),
});

export type UserQuery = z.infer<typeof userQuerySchema>;

export default userQuerySchema;