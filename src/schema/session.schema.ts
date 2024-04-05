import { object, string, TypeOf, z } from 'zod'

const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'please enter your email address'
        }).email({
            message: 'Invalid email, please provide a valid email address'
        }),
        password: string({
            required_error: 'please enter your password'
        })
    })
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;

export default createSessionSchema;