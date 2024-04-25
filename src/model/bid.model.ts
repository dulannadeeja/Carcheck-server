import mongoose, { ObtainDocumentType, Schema } from "mongoose";

const bidSchema = new Schema({
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const BidModel = mongoose.model('Bid', bidSchema);

export interface BidDocument extends mongoose.Document {
    listing: string;
    bidder: string;
    amount: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type BidInput = ObtainDocumentType<Omit<BidDocument, 'createdAt' | 'updatedAt' | 'isDeleted'>>

export default BidModel;