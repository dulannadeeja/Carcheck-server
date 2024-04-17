import { boolean, object, string, TypeOf, z } from 'zod'

const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Please enter your email address or username'
        }),
        password: string({
            required_error: 'Please enter your password'
        }),
        staySignedIn: boolean().default(false)
    })
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;

export default createSessionSchema;