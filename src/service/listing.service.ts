import { FilterQuery, ObtainDocumentType, QueryOptions } from "mongoose";
import listingModel, { ListingDocument } from "../model/listing.model";

export const createVehicleListing = async (input: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        const listing = await listingModel.create(input);
        return listing;
    } catch (err: any) {
        throw new Error(err);
    }
}

export const findListing = async (query: FilterQuery<ListingDocument>) => {
    try {
        return await listingModel.findOne(query).lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const findListings = async (query: FilterQuery<ListingDocument>, options: QueryOptions) => {

    try {
        // find the listings
        return await listingModel.find(query, null, options).lean();
    } catch (err: any) {
        throw new Error(err);
    }

}

export const countListings = async (query: FilterQuery<ListingDocument>) => {
    try {
        return await listingModel.countDocuments(query);
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateListing = async (query: FilterQuery<ListingDocument>, updates: Partial<ListingDocument> ) => {
    try {
        const updatedListing = await listingModel.findOneAndUpdate(query, updates,{
            new: true
        }).lean();
        return updatedListing;
    } catch (error:any) {
        throw new Error(error);
    }
}