import { z } from "zod";
import {
    conditionsArray,
    driveTypesArray,
    fuelTypeArray,
    transmissionArray,
    listingStateArray,
    listingTypeArray,
    Conditions,
    Transmissions,
    FuelTypes,
    DriveTypes,
    ListingType,
    ListingState,
} from "../model/listing.model";
import { vehicleCategoryArray, vehicleMakeArray } from "../model/vehicle.model";

const currentYear = new Date().getFullYear();

const vehicleMakeValidator = z.string().refine(
    (make) => vehicleMakeArray.some((vehicleMake) => vehicleMake.toLowerCase() === make.toLowerCase()),
    {
        message: "Invalid vehicle make. Please select a valid make from the list.",
    }
);

const vehicleCategoryValidator = z.string().refine(
    (category) => vehicleCategoryArray.some((vehicleCategory) => vehicleCategory.toLowerCase() === category.toLowerCase()),
    {
        message: "Invalid vehicle category. Please select a valid category from the list.",
    }
);

const yearValidator = z.number().min(1900, "Year must be 1900 or later.").max(currentYear, `Year cannot exceed the current year (${currentYear}).`);

const photoValidator = z.array(z.string()).min(1, "At least one photo is required.");

const auctionSchema = z.object({
    duration: z.number().min(1, "Auction duration must be at least 1 day."),
    startingBid: z.number().min(1, "Starting bid must be 1LKR or more."),
    startDate: z.date().refine((date) => date >= new Date(), {
        message: "Auction start date must be today or later.",
    }),
    endDate: z.date(),
    reservePrice: z.number().min(1, "Reserve price must be $1 or more.").optional(),
    currentBid: z.number().min(1, "Current bid must be $1 or more.").optional(),
    bidders: z.array(z.string()).optional(),
    maxBid: z.number().min(1, "Maximum bid must be $1 or more.").optional(),
    maxBidder: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
    message: "Auction end date must be after the start date.",
    path: ["endDate"],
})

const locationSchema = z.object({
    city: z.string({
        required_error: "Please enter a city.",
    }),
    division: z.string({
        required_error: "Please enter a division.",
    }),
    zipCode: z.string({
        required_error: "Please enter a zip code.",
    }),
});

const bodySchema = z.object({
    make: vehicleMakeValidator,
    vehicleModel: z.string(
        {
            required_error: "Please enter a vehicle model.",
        }
    ),
    category: vehicleCategoryValidator,
    manufacturedYear: yearValidator,
    registeredYear: yearValidator,
    photos: photoValidator,
    title: z.string().min(1, "Title is required.").max(80, "Title must be under 80 characters."),
    condition: z.string().refine((condition) => conditionsArray.includes(condition as Conditions), {
        message: "Invalid condition. Please select a valid condition from the list.",
    }),
    mileage: z.number().min(0, "Mileage must be non-negative."),
    transmission: z.string().refine((transmission) => transmissionArray.includes(transmission as Transmissions), {
        message: "Invalid transmission type. Please select a valid type from the list.",
    }),
    fuelType: z.string().refine((fuelType) => fuelTypeArray.includes(fuelType as FuelTypes), {
        message: "Invalid fuel type. Please select a valid type from the list.",
    }),
    bodyType: vehicleCategoryValidator,
    driveType: z.string().refine((driveType) => driveTypesArray.includes(driveType as DriveTypes), {
        message: "Invalid drive type. Please select a valid type from the list.",
    }),
    numberOfSeats: z.number().min(1, "Number of seats must be at least 1."),
    numberOfDoors: z.number().min(1, "Number of doors must be at least 1."),
    exteriorColor: z.string().min(1, "Exterior color is required."),
    interiorColor: z.string().min(1, "Interior color is required."),
    numberOfPreviousOwners: z.number().min(0, "Number of previous owners must be non-negative."),
    maxFuelConsumption: z.number().min(1, "Maximum fuel consumption must be at least 1 km/L."),
    minFuelConsumption: z.number().min(1, "Minimum fuel consumption must be at least 1 km/L."),
    engineCapacity: z.number().min(1, "Engine capacity must be at least 100cc."),
    description: z.string(
        {
            required_error: "Please enter a description.",
        }
    )
        .min(80, "Description must be at least 80 characters.")
        .max(500, "Description must be under 500 characters."),
    listingType: z.string({
        required_error: "Please select a listing type.",
    }).refine((type) => listingTypeArray.includes(type as ListingType), {
        message: "Invalid listing type. Please select a valid type from the list.",
    }),
    fixedPrice: z.number(
        {
            required_error: "Please enter a fixed price.",
        }
    ).min(1, "Fixed price must be 1LKR or more."),
    auction: auctionSchema.optional(),
    location: locationSchema,
    state: z.string().refine((state) => listingStateArray.includes(state as ListingState), {
        message: "Invalid listing state. Please select a valid state from the list.",
    }),
    inspectionReport: z.string().optional(),
    numberOfWatchers: z.number().optional(),
    watchers: z.array(z.string()).optional(),
})
    .refine(({ manufacturedYear, registeredYear }) => manufacturedYear <= registeredYear, {
        message: "Manufactured year must not exceed the registered year.",
    })
    .refine(({ maxFuelConsumption, minFuelConsumption }) => maxFuelConsumption >= minFuelConsumption, {
        message: "Maximum fuel consumption must be equal to or greater than minimum fuel consumption.",
    });

const createListingSchema = bodySchema.superRefine((data, ctx) => {
    if (data.listingType === ListingType.auction && data.auction === undefined) {
        ctx.addIssue({
            path: ["auction"],
            message: "Auction details are required for auction listings.",
            code: z.ZodIssueCode.custom,
        });
    } else if (data.listingType !== ListingType.auction && data.auction !== undefined) {
        // Optionally, ensure auction details are only provided for auction listings
        ctx.addIssue({
            path: ["auction"],
            message: "Auction details should not be provided for non-auction listings.",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const listingSchema = z.object({
    body: createListingSchema
});

export type ListingSchema = z.infer<typeof listingSchema>;
