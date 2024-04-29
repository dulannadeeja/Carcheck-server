import { z } from "zod";
import { Conditions, conditionsArray, ListingType, listingTypeArray } from "../model/listing.model";


const currentYear = new Date().getFullYear();

// define validators for each field

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
        images: z.array(z.string()).min(1, "At least one photo is required."),
        title: z.string().min(1, "Looks like you missed the title").max(80, "Title must be under 80 characters."),
        make: z.string().min(1, "Looks like you missed the make."),
        condition: conditionValidator,
        vehicleModel: z.string().min(1, "Looks like you missed the model."),
        manufacturedYear: yearValidator,
        registeredYear: yearValidator,
        mileage: z.number().min(0, "Looks like you missed the mileage.").max(1000000, "Mileage cannot exceed 1,000,000 km."),
        transmission: z.string().min(1, "Looks like you missed the transmission."),
        fuelType: z.string().min(1, "Looks like you missed the fuel type."),
        bodyType: z.string().min(1, "Looks like you missed the body type."),
        driveType: z.string().min(1, "Looks like you missed the drive type."),
        numberOfPreviousOwners: z.number().min(0, "must be 0 or more."),
        exteriorColor: z.string().min(1, "Looks like you missed the exterior color."),
        numberOfSeats: z.number().min(0, "must be 0 or more."),
        numberOfDoors: z.number().min(0, "must be 0 or more."),
        interiorColor: z.string().optional(),
        maxFuelConsumption: z.number().min(0, "Please enter the maximum fuel consumption."),
        minFuelConsumption: z.number().min(0, "Please enter the minimum fuel consumption."),
        engineCapacity: z.number().min(600, "Engine capacity must be 600cc or more."),
        description: descriptionValidator,
        listingType: listingTypeValidator,
        fixedPrice: z.number().optional(),
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
        if (data.auction.duration <= 0) {
            ctx.addIssue({
                path: ["auction", "duration"],
                message: "You need to set the duration of your auction.",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.auction.startingBid <= 0) {
            ctx.addIssue({
                path: ["auction", "startingBid"],
                message: "You need to set the starting bid for your auction.",
                code: z.ZodIssueCode.custom,
            });
        }
        if (data.fixedPrice && data.fixedPrice > 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep fixed price empty for auction listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if starting bid is provided, reserve price should be greater than starting bid
    if (data.auction?.reservePrice && data.auction?.startingBid && data.auction?.reservePrice < data.auction?.startingBid) {
        ctx.addIssue({
            path: ["auction", "reservePrice"],
            message: "Reserve price should be higher than starting bid.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if listing type is fixed price, auction details should be empty
    if (data.listingType === ListingType.fixedPrice) {

        if ( data.auction && data.auction.duration > 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction duration empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.auction && data.auction.startingBid > 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction starting bid empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.auction && data.auction.reservePrice > 0) {
            ctx.addIssue({
                path: ["listingType"],
                message: "Please keep auction reserve price empty for fixed price listings",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if listing type is fixed price, fixed price should be provided
    if (data.listingType === ListingType.fixedPrice && !data.fixedPrice) {
        ctx.addIssue({
            path: ["fixedPrice"],
            message: "You need to set a price for your listing.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if accepted offer is enabled, minimum offer required
    if (data.isAllowedOffer) {
        if (data.offer && data.offer.minimumOffer <= 0) {
            ctx.addIssue({
                path: ["offer", "minimumOffer"],
                message: "Looks like you missed the minimum offer.",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // if minimum and auto accept offer is provided, auto accept offer should be greater than minimum offer
    if (data.isAllowedOffer && data.offer?.autoAcceptOffer && data.offer?.minimumOffer && data.offer?.autoAcceptOffer < data.offer?.minimumOffer) {
        ctx.addIssue({
            path: ["offer", "autoAcceptOffer"],
            message: "Auto accept offer should be higher than minimum offer.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if max and min fuel consumption is provided, max should be greater than min
    if (data.maxFuelConsumption < data.minFuelConsumption) {
        ctx.addIssue({
            path: ["maxFuelConsumption"],
            message: "Min and max values do not match. Please check again.",
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
    if (data.condition === Conditions.preOwned && data.numberOfPreviousOwners <= 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Please enter the number of previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is unregistered previous owners should be 0
    if (data.condition === Conditions.unregistered  && data.numberOfPreviousOwners !== 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Unregistered vehicles should have 0 previous owners.",
            code: z.ZodIssueCode.custom,
        });
    }

    // if condition is brand new, previous owners should be 0
    if (data.condition === Conditions.brandNew && data.numberOfPreviousOwners !== 0) {
        ctx.addIssue({
            path: ["numberOfPreviousOwners"],
            message: "Brand new vehicles should have 0 previous owners.",
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
    if (data.condition === Conditions.preOwned && data.mileage <= 0) {
        ctx.addIssue({
            path: ["mileage"],
            message: "Looks like you missed the mileage.",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const listingSchema = createListingSchema;

export type ListingSchema = z.infer<typeof listingSchema>;
export type AuctionSchema = z.infer<typeof auctionSchema>;
export type LocationSchema = z.infer<typeof locationSchema>;
export type OfferSchema = z.infer<typeof offerSchema>;