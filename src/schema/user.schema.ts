import { object, string, TypeOf, z } from 'zod'


export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'please enter your first name'
        }),
        lastName: string({
            required_error: 'please enter your last name'
        }),
        email: string({
            required_error: 'please enter your email address'
        }).email({
            message: 'Invalid email, please provide a valid email address'
        }),
        password: string({
            required_error: 'please enter your password'
        }).min(6, 'Password must be at least 6 characters long'),
        confirmPassword: string({
            required_error: 'please confirm your password'
        }),
        avatar: string({

        }).optional(),
        role: z.enum(['buyer-personal', 'buyer-business', 'seller-personal', 'seller-business', 'admin', 'service-point']).default('buyer-personal'),
        mobile: string().optional(),
        isVerified: z.boolean().default(false)
    })
        .refine(data => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword']
        })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;;