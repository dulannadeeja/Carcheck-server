import mongoose, { ObjectId, Schema } from "mongoose";

export type Auction = {
    duration: number;
    startDate: Date;
    endDate: Date;
    startingBid: number;
    reservePrice: number;
    currentBid: number;
    bidders: string[];
}

export enum Conditions {
    brandNew = 'Brand New',
    preOwned = 'Pre-Owned',
    unregistered = 'Unregistered'
}

export enum Transmissions {
    automatic = 'Automatic',
    manual = 'Manual',
    semiAutomatic = 'Semi-Automatic',
    tiptronic = 'Tiptronic',
    multitronic = 'Multitronic',
    steptronic = 'Steptronic',
    powershift = 'Powershift',
    paddleShift = 'Paddle Shift'
}

export enum FuelTypes {
    petrol = 'Petrol',
    diesel = 'Diesel',
    hybrid = 'Hybrid',
    electric = 'Electric',
}

export enum DriveTypes {
    FOURWD = '4WD- 4 Wheel Drive',
    AWD = 'AWD - All Wheel Drive',
    FWD = 'FWD - Front Wheel Drive',
    RWD = 'RWD - Rear Wheel Drive',
}

export enum ListingType {
    fixedPrice = 'Fixed Price',
    auction = 'Auction'
}

export enum ListingState {
    pending = 'Pending',
    active = 'Active',
    inactive = 'Inactive',
    sold = 'Sold'
}

export const conditionsArray = Object.values(Conditions);
export const transmissionArray = Object.values(Transmissions);
export const fuelTypeArray = Object.values(FuelTypes);
export const driveTypesArray = Object.values(DriveTypes);
export const listingTypeArray = Object.values(ListingType);
export const listingStateArray = Object.values(ListingState);

export interface ListingDocument{
    make: string;
    model: string;
    manufacturedYear: number;
    registeredYear: boolean;
    photos: string[];
    title: string;
    condition: string;
    mileage: number;
    transmission: string;
    fuelType: string;
    bodyType: string;
    driveType: string;
    numberOfSeats: number;
    numberOfDoors: number;
    ExteriorColor: string;
    InteriorColor: string;
    numberOfPreviousOwners: number;
    maxFuelConsumption: number;
    minFuelConsumption: number;
    engineCapacity: number;
    description: string;
    listingType: string;
    fixedPrice: number;
    auction: Auction;
    location: {
        city: string;
        division: string;
        zipCode: string;
    };
    state: string;
    inspectionReport: string;
    numberOfWatchers: number;
    watchers: string[];
    createdAt: Date;
    updatedAt: Date;

}

const listingSchema = new Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    manufacturedYear: { type: Number, required: true },
    registeredYear: { type: Boolean, required: true },
    photos: { type: [String], required: true },
    title : { type: String, required: true },
    condition: { type: String, required: true },
    mileage: { type: Number, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    bodyType: { type: String, required: true },
    driveType: { type: String, required: true },
    numberOfSeats: { type: Number, required: true },
    numberOfDoors: { type: Number, required: true },
    ExteriorColor: { type: String, required: true },
    InteriorColor: { type: String, required: true },
    numberOfPreviousOwners: { type: Number, required: true },
    maxFuelConsumption: { type: Number, required: true },
    minFuelConsumption: { type: Number, required: true },
    engineCapacity: { type: Number, required: true },
    description: { type: String, required: true },
    listingType: { type: String, required: true },
    fixedPrice: { type: Number, required: true },
    auction: { type: Object({
        duration: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        startingBid: { type: Number, required: true },
        reservePrice: { type: Number, required: true },
        currentBid: { type: Number, required: true },
        bidders: { type: [Schema.Types.ObjectId], required: true, ref: 'User'},
        maxBid: { type: Number, required: true },
        maxBidder: { type: Schema.Types.ObjectId, required: true, ref: 'User'}
    }), required: true },
    location: { type: Object({
        city: { type: String, required: true },
        division: { type: String, required: true },
        zipCode: { type: String, required: true }
    }), required: true },
    state : { type: String, required: true },
    inspectionReport: { type: String, required: true },
    numberOfWatchers: { type: Number, required: true },
    watchers: { type: [Schema.Types.ObjectId], required: true, ref: 'User' }
})

const listingModel = mongoose.model<ListingDocument>('Listing', listingSchema);

export default listingModel;