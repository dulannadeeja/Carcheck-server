import { object, string, z } from "zod";

export const brandSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        })
    })
})

export type BrandInput = z.infer<typeof brandSchema>;