import { object, string } from "zod";


export const categorySchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        specType: string({
            required_error: 'Type is required'
        })
    })
})

export type CategoryInput = {
    body: {
        name: string;
    }
}