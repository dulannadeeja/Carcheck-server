import { ObtainDocumentType } from "mongoose";
import listingModel, { ListingDocument } from "../model/listing.model";

export const createVehicleListing = async (input: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        const listing = await listingModel.create(input);
        console.log(listing.toJSON());
        return listing;
    } catch (err: any) {
        throw new Error(err);
    }
}