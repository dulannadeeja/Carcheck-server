import { z } from "zod";


export const inspectionRequestSchema = z.object({
    body: z.object({
        listing: z.string(),
        serviceProvider: z.string().min(1, "Please choose a service provider fits your needs."),
        serviceBranch: z.string().min(1, "Please enter choose a service branch."),
        inspectionDate: z.string({
            invalid_type_error: "Please select a date for inspection.",
            required_error: "Please select a date for inspection.",
        }).refine((date) => new Date(date) > new Date(), {
            message: "Please select a date in the future",
        }),
        inspectionTime: z.string({
            required_error: "Please select a time for inspection.",
            invalid_type_error: "Please select a time for inspection.",
        }).refine((date) => new Date(date) > new Date(), {
            message: "Please select a time in the future",

        }),
        contactNumber: z.string().min(9, "Please enter 9 digit contact number.").max(
            9,
            "Mobile Can't have more than 9 digits."
        ),
    })
});

export type InspectionRequestType = z.infer<typeof inspectionRequestSchema>;


