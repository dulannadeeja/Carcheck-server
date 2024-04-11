import { z } from "zod";
import { colorOptions, Conditions, conditionsArray, DriveTypes, driveTypesArray, fuelTypeArray, FuelTypes, ListingType, listingTypeArray, transmissionArray, Transmissions } from "../model/listing.model";
import { vehicleCategoryArray, vehicleMakeArray } from "../model/vehicle.model";

const currentYear = new Date().getFullYear();

// define validators for each field

const titleValidator = z.string().min(1, "Title is need to search your listing, please enter your own.").max(80, "Title must be under 80 characters.");

const conditionValidator = z.string().refine(
    (condition) => conditionsArray.some((conditionName) => conditionName.toLowerCase() === condition.toLowerCase()),
    {
        message: "Please select the condition. It may be Brand New, Pre-Owned or Unregistered",
    }
);

const vehicleMakeValidator = z.string().refine(
    (make) => vehicleMakeArray.some((vehicleMake) => vehicleMake.toLowerCase() === make.toLowerCase()),
    {
        message: "Please select the vehicle make from the dropdown list.",
    }
);

const vehicleModelValidator = z.string().min(1, "Please enter the model of the vehicle.");

const vehicleCategoryValidator = z.string().refine(
    (category) => vehicleCategoryArray.some((vehicleCategory) => vehicleCategory.toLowerCase() === category.toLowerCase()),
    {
        message: "Please select the shape of the vehicle from the dropdown list.",
    }
);

const yearValidator = z.number().min(1900, "We do not support for vehicles before 1900.").max(currentYear, `Year cannot exceed the current year (${currentYear}).`);

const mileageValidator = z.number().min(0, "Please enter the current mileage of the vehicle.");

const transmissionValidator = z.string().refine((transmission) => transmissionArray.includes(transmission as Transmissions), {
    message: "Please select the type of transmission.",
});

const fuelTypeValidator = z.string().refine((fuelType) => fuelTypeArray.includes(fuelType as FuelTypes), {
    message: "Please select the type of fuel.",
})

const driveTypeValidator = z.string().refine((driveType) => driveTypesArray.includes(driveType as DriveTypes), {
    message: "Please select the type of drive.",
})

const exteriorColorValidator = z.string().refine((color) => colorOptions.includes(color), {
    message: "Please select the exterior color.",
})

// im stop here
const interiorColorValidator = z.string().optional().refine((color) => {
    if (color) {
        return colorOptions.includes(color);
    }
    return true;
}, {
    message: "Please select the interior color.",
})

const numberOfPreviousOwnersValidator = z.number().min(0, "Previous owners must be 0 or more.");

const descriptionValidator = z.string().min(80, "Description must be at least 80 characters.").max(500, "Description must be under 500 characters.");

const listingTypeValidator = z.string().refine((type) => listingTypeArray.includes(type as ListingType), {
    message: "Please select the format of the listing, it may Fixed price or auction.",
})

const imagesValidator = z.array(z.string()).min(1, "Please upload at least one photo.");

const auctionSchema = z.object({
    duration: z.number().optional().default(0),
    startingBid: z.number().optional().default(0),
    reservePrice: z.number().optional().default(0),
    currentBid: z.number().optional().default(0),
    bidders: z.array(z.string()).optional(),
    maxBid: z.number().optional().default(0),
    maxBidder: z.string().optional(),
})

const locationSchema = z.object({
    city: z.string().min(1, "Please enter a city."),
    division: z.string().min(1, "Please enter a divison."),
    zipCode: z.string().min(1, "Please enter zip code."),
});


// define the schema for the listing
const bodySchema = z.object({
    body: z.object({
        images: imagesValidator,
        title: titleValidator,
        make: vehicleMakeValidator,
        condition: conditionValidator,
        vehicleModel: vehicleModelValidator,
        manufacturedYear: yearValidator,
        registeredYear: yearValidator,
        mileage: mileageValidator,
        transmission: transmissionValidator,
        fuelType: fuelTypeValidator,
        bodyType: vehicleCategoryValidator,
        driveType: driveTypeValidator,
        numberOfPreviousOwners: numberOfPreviousOwnersValidator,
        exteriorColor: exteriorColorValidator,
        numberOfSeats: z.number().min(0, "must be 0 or more.").default(0),
        numberOfDoors: z.number().min(0, "must be 0 or more.").default(0),
        interiorColor: interiorColorValidator,
        maxFuelConsumption: z.number().min(0, "Please enter the maximum fuel consumption.").default(0),
        minFuelConsumption: z.number().min(0, "Please enter the minimum fuel consumption.").default(0),
        engineCapacity: z.number().min(600, "Engine capacity must be 600cc or more."),
        description: descriptionValidator,
        listingType: listingTypeValidator,
        fixedPrice: z.number().optional().default(0),
        auction: auctionSchema.optional(),
        location: locationSchema,
        isAllowedOffer: z.boolean().optional().default(false),
        offer: z.object({
            minimumOffer: z.number().optional().default(0),
            autoAcceptOffer: z.number().optional().default(0),
        }).optional()
    }),
})

// refine the schema to add custom validations
const createListingSchema = bodySchema.superRefine((data, ctx) => {

    // if listing type is auction, auction details are required
    if (data.body.listingType === ListingType.auction && data.body.auction) {
        if (data.body.auction.duration === 0) {
            ctx.addIssue({
                path: ["auction", "duration"],
                message: "Auction duration is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.body.auction.startingBid === 0) {
            ctx.addIssue({
                path: ["auction", "startingBid"],
                message: "Starting bid is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.body.auction.reservePrice === 0) {
            ctx.addIssue({
                path: ["auction", "reservePrice"],
                message: "Reserve price is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.body.fixedPrice !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep fixed price empty for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if listing type is fixed price, fixed price is required
    if (data.body.listingType === ListingType.fixedPrice && data.body.fixedPrice === 0) {
        ctx.addIssue({
            path: ["fixedPrice"],
            message: "Please give a fixed price for the listing",
            code: z.ZodIssueCode.custom,
        });

        if (data.body.auction?.duration !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction duration empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.body.auction?.startingBid !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction starting bid empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.body.auction?.reservePrice !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction reserve price empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if accepted offer is enabled, minimum offer required
    if (data.body.isAllowedOffer) {
        if (data.body.offer?.minimumOffer === 0) {
            ctx.addIssue({
                path: ["offer", "minimumOffer"],
                message: "Please enter the minimum offer amount",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if max and min fuel consumption is provided, max should be greater than min
    if (data.body.maxFuelConsumption < data.body.minFuelConsumption) {
        ctx.addIssue({
            path: ["maxFuelConsumption"],
            message: "Maximum fuel consumption must be higher than minimum.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if manufactured and registered year is provided, registered year should be greater than or equal to manufactured year
    if (data.body.manufacturedYear > data.body.registeredYear) {
        ctx.addIssue({
            path: ["registeredYear"],
            message: "Registration year should be same or after the manufacture year.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is pre-owned, previous owners should be provided
    if (data.body.condition === Conditions.preOwned && data.body.numberOfPreviousOwners === 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Please enter the number of previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is brand new, previous owners should be 0
    if (data.body.condition === Conditions.brandNew && data.body.numberOfPreviousOwners !== 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Brand new vehicles should have 0 previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is unregistered or brand new, previous owners should be 0
    if (data.body.condition === Conditions.unregistered || data.body.condition === Conditions.brandNew && data.body.numberOfPreviousOwners !== 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Unregistered vehicles should have 0 previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is brand new, mileage should be 0
    if (data.body.condition === Conditions.brandNew) {
        if (data.body.mileage !== 0) {
            ctx.addIssue({
                path: ["mileage"],
                message: "Brand new vehicles should have 0 mileage.",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if condition is pre-owned, mileage should be greater than 0
    if (data.body.condition === Conditions.preOwned && data.body.mileage === 0) {
        ctx.addIssue({
            path: ["mileage"],
            message: "Please enter the mileage of the vehicle.",
            code: z.ZodIssueCode.custom,
        });
    }
});


// validate a single field
export const validateField = (fieldName: keyof ListingSchema, value: string): undefined | string => {

    let tempObj = {};

    // if fieldName is a combination of parent and child, split and create the object
    if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        tempObj = {
            [parent]: {
                [child]: value
            }
        };
    } else {
        tempObj = { [fieldName]: value };
    }

    try {
        listingSchema.parse(tempObj);
        return undefined;
    } catch (error) {
        if (error instanceof z.ZodError) {
            // we only validate one field, return the message for the first error, if exists
            const firstError = error.errors.find(e => e.path.includes(fieldName as string));
            if (firstError) {
                return firstError ? firstError.message : "Invalid field value";
            }

        }
        return undefined;
    }
}

export const listingSchema = createListingSchema;

export type ListingSchema = z.infer<typeof listingSchema>;