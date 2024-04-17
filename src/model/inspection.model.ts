import mongoose, { Schema } from "mongoose";
import { UserDocument } from "./user.model";
import { ListingDocument } from "./listing.model";

export interface InspectionDocument extends mongoose.Document{
    serviceProvider: UserDocument['_id'],
    seller: UserDocument['_id'],
    listing: ListingDocument['_id'],
    serviceBranch: string,
    inspectionDateTime: Date
}

const inspectionSchema = new Schema({
    serviceProvider: { type: Schema.Types.ObjectId,ref:'User', required:true  },
    serviceBranch: { type: String, required:true },
    inspectionDateTime: { type: Date, required:true },
    listing: { type: Schema.Types.ObjectId , ref:'Listing', required:true },
    seller: { type: Schema.Types.ObjectId, ref:'User', required:true  }
})

const inspectionModel = mongoose.model('Inspection', inspectionSchema);

export default inspectionModel;