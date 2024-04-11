import { z, object, nativeEnum } from "zod";

import { vehicleMakeArray, VehicleCategory, VehicleMake, vehicleCategoryArray } from "../model/vehicle.model";

const currentYear = new Date().getFullYear();

export const createVehicleSchema = object({
    body: object({
        make: z.string({
            required_error: "Please select a vehicle make."
        }).refine(make => vehicleMakeArray.some(vehicleMake => vehicleMake.toLocaleLowerCase() === make.toLocaleLowerCase()), {
            message: "Invalid vehicle make. Please select a valid make."
        }),
        vehicleModel: z.string().min(1, "Model name cannot be empty."),
        category: z.string({
            required_error: "Please select a vehicle category."
        }).refine(category => vehicleCategoryArray.some(
            vehicleCategory => vehicleCategory.toLocaleLowerCase() === category.toLocaleLowerCase()
        ), {
            message: "Invalid vehicle category. Please select a valid category."
        })
    })
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

