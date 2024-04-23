import { z } from "zod";
import { Conditions, conditionsArray, ListingType, listingTypeArray } from "../model/listing.model";


const currentYear = new Date().getFullYear();

// define validators for each field

const titleValidator = z.string().min(1, "Looks like you missed the title").max(80, "Title must be under 80 characters.");

const conditionValidator = z.string().refine(
    (condition) => conditionsArray.some((conditionName) => conditionName.toLowerCase() === condition.toLowerCase()),
    {
        message: "Please select the condition. It may be Brand New, Pre-Owned or Unregistered",
    }
);

const descriptionValidator = z.string().min(80, "Description must be at least 80 characters.").max(500, "Description must be under 500 characters.");

const listingTypeValidator = z.string().refine((type) => listingTypeArray.includes(type as ListingType), {
    message: "Please select the format of the listing, it may Fixed price or auction.",
})

const imagesValidator = z.array(z.string()).min(1, "At least one photo is required.");

const yearValidator = z.number().min(1900, "We do not support for vehicles before 1900.").max(currentYear, `Year cannot exceed the current year (${currentYear}).`);


const auctionSchema = z.object({
    duration: z.number().optional().default(0),
    startingBid: z.number().optional().default(0),
    reservePrice: z.number().optional().default(0),
})

const locationSchema = z.object({
    city: z.string().min(1, "Please enter a city."),
    division: z.string().min(1, "Please enter a divison."),
    zipCode: z.string().min(1, "Please enter zip code."),
});

const offerSchema = z.object({
    minimumOffer: z.number().optional().default(0),
    autoAcceptOffer: z.number().optional().default(0),
})


// define the schema for the listing
const bodySchema = z.object({
    body: z.object({
        images: imagesValidator,
        title: titleValidator,
        make: z.string().min(1, "Looks like you missed the make."),
        condition: conditionValidator,
        vehicleModel: z.string().min(1, "Looks like you missed the model."),
        manufacturedYear: yearValidator,
        registeredYear: yearValidator,
        mileage: z.number().min(0, "Looks like you missed the mileage."), // mileage can be 0 for brand new vehicles
        transmission: z.string().min(1, "Looks like you missed the transmission."),
        fuelType: z.string().min(1, "Looks like you missed the fuel type."),
        bodyType: z.string().min(1, "Looks like you missed the body type."),
        driveType: z.string().min(1, "Looks like you missed the drive type."),
        numberOfPreviousOwners: z.number().min(0, "must be 0 or more.").default(0),
        exteriorColor: z.string().min(1, "Looks like you missed the exterior color."),
        numberOfSeats: z.number().min(0, "must be 0 or more.").default(0),
        numberOfDoors: z.number().min(0, "must be 0 or more.").default(0),
        interiorColor: z.string().optional(),
        maxFuelConsumption: z.number().min(0, "Please enter the maximum fuel consumption.").default(0),
        minFuelConsumption: z.number().min(0, "Please enter the minimum fuel consumption.").default(0),
        engineCapacity: z.number().min(600, "Engine capacity must be 600cc or more."),
        description: descriptionValidator,
        listingType: listingTypeValidator,
        fixedPrice: z.number().optional().default(0),
        auction: auctionSchema.optional(),
        location: locationSchema,
        isAllowedOffer: z.boolean().optional().default(false),
        offer: offerSchema.optional(),
    })
})

// refine the schema to add custom validations
const createListingSchema = bodySchema.superRefine((schemaData, ctx) => {
    const {body:data} = schemaData;
    // if listing type is auction, auction details are required
    if (data.listingType === ListingType.auction && data.auction) {
        if (data.auction.duration === 0) {
            ctx.addIssue({
                path: ["auction", "duration"],
                message: "Auction duration is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.auction.startingBid === 0) {
            ctx.addIssue({
                path: ["auction", "startingBid"],
                message: "Starting bid is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.auction.reservePrice === 0) {
            ctx.addIssue({
                path: ["auction", "reservePrice"],
                message: "Reserve price is required for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.fixedPrice !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep fixed price empty for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if listing type is fixed price, fixed price is required
    if (data.listingType === ListingType.fixedPrice && data.fixedPrice === 0) {
        ctx.addIssue({
            path: ["fixedPrice"],
            message: "Please give a fixed price for the listing",
            code: z.ZodIssueCode.custom,
        });

        if (data.auction?.duration !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction duration empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.auction?.startingBid !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction starting bid empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.auction?.reservePrice !== 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction reserve price empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if accepted offer is enabled, minimum offer required
    if (data.isAllowedOffer) {
        if (data.offer?.minimumOffer === 0) {
            ctx.addIssue({
                path: ["offer", "minimumOffer"],
                message: "Please enter the minimum offer amount",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if max and min fuel consumption is provided, max should be greater than min
    if (data.maxFuelConsumption < data.minFuelConsumption) {
        ctx.addIssue({
            path: ["maxFuelConsumption"],
            message: "Maximum fuel consumption must be higher than minimum.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if manufactured and registered year is provided, registered year should be greater than or equal to manufactured year
    if (data.manufacturedYear > data.registeredYear) {
        ctx.addIssue({
            path: ["registeredYear"],
            message: "Registration year should be same or after the manufacture year.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is pre-owned, previous owners should be provided
    if (data.condition === Conditions.preOwned && data.numberOfPreviousOwners === 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Please enter the number of previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is unregistered or brand new, previous owners should be 0
    if (data.condition === Conditions.unregistered || data.condition === Conditions.brandNew && data.numberOfPreviousOwners > 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Unregistered vehicles should have 0 previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is brand new, mileage should be 0
    if (data.condition === Conditions.brandNew) {
        if (data.mileage !== 0) {
            ctx.addIssue({
                path: ["mileage"],
                message: "Brand new vehicles should have 0 mileage.",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if condition is pre-owned, mileage should be greater than 0
    if (data.condition === Conditions.preOwned && data.mileage === 0) {
        ctx.addIssue({
            path: ["mileage"],
            message: "Please enter the mileage of the vehicle.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if starting bid is provided, reserve price should be greater than starting bid
    if (data.auction?.reservePrice && data.auction?.startingBid && data.auction?.reservePrice < data.auction?.startingBid) {
        ctx.addIssue({
            path: ["auction", "reservePrice"],
            message: "Reserve price should be higher than starting bid.",
            code: z.ZodIssueCode.custom,
        });
    }

    // is offer is allowed, auto accept offer should be greater than minimum offer
    if (data.isAllowedOffer && data.offer?.autoAcceptOffer && data.offer?.autoAcceptOffer < data.offer?.minimumOffer) {
        ctx.addIssue({
            path: ["offer", "autoAcceptOffer"],
            message: "Auto accept offer should be higher than minimum offer.",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const listingSchema = createListingSchema;

export type ListingSchema = z.infer<typeof listingSchema>;
export type AuctionSchema = z.infer<typeof auctionSchema>;
export type LocationSchema = z.infer<typeof locationSchema>;
export type OfferSchema = z.infer<typeof offerSchema>;