import { object, string, TypeOf, z } from 'zod'

import { AccountType } from '../model/user.model';


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
        password: z.string({
            required_error: 'please enter your password'
        })
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
        avatar: string({

        }).optional(),
        accountType: z.nativeEnum(AccountType).default(AccountType.buyerPersonal),
        phone: string().optional(),
        isVerified: z.boolean().default(false),
        businessName: string().optional(),
    })
}).refine((data) => {
    // Conditionally requiring `businessName` based on `accountType`
    if ([AccountType.buyerBusiness, AccountType.sellerBusiness, AccountType.servicePoint].includes(data.body.accountType) && !data.body.businessName) {
        return false; // Fails the refinement if `accountType` is business but `businessName` is not provided
    }
    return true;
}, {
    message: "Business name is required for business accounts",
    path: ["businessName"]
});


export type CreateUserInput = TypeOf<typeof createUserSchema>;;