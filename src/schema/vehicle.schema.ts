import { z, object, array} from "zod";

export const createVehicleSchema = object({
    body: object({
        make: z.string({
            required_error: "Please select a vehicle make."
        }),
        vehicleModel: z.string().min(1, "Model name cannot be empty."),
        category: array(z.string()).min(1, "Please select at least one category."),
    })
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

