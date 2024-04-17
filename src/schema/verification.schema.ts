import { object, string, TypeOf, z } from 'zod'

export enum VerificationType {
    email = 'email',
    phone = 'phone'
}

const verificationSchema = object({
    body: object({
        type: string().refine(val => Object.values(VerificationType).includes(val as VerificationType), {
            message: 'Invalid verification type',
            path: ['type']
        }),
        target: string(),
    })
        .refine(({ type, target }) => {
            if (type === VerificationType.email) {
                return z.string().email().parse(target);
            }
            return true
        }, {
            message: 'Please provide a valid email address',
            path: ['email']
        }
        ).refine(({ type, target }) => {
            if (type === VerificationType.phone) {
                return /^[0-9]{9}$/.test(target);
            }
            return true
        }, {
            message: 'Phone number should be 9 digits',
            path: ['phone']
        })
});

export type VerificationInput = TypeOf<typeof verificationSchema>;

export default verificationSchema;