
// mongoose model of brand

import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    index: { type: Number, required: true },
})

export interface BrandDocument extends mongoose.Document{
    name: string;
    index: number;
}

const BrandModel = mongoose.model<BrandDocument>("Brand", brandSchema);

export default BrandModel;