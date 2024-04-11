import { ObtainDocumentType } from "mongoose";
import listingModel, { ListingDocument } from "../model/listing.model";

export const createVehicleListing = async (input: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        return await listingModel.create(input);
    } catch (err: any) {
        throw new Error(err);
    }
}