import mongoose, { Schema } from "mongoose";

export interface VehicleDocument{
    isDeleted: boolean;
    make: string;
    vehicleModel: string;
    category: string[];
}

const vehicleSchema = new Schema({
    isDeleted: { type: Boolean, default: false },
    make: { type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    vehicleModel: { type: String },
    category: [{ type: String, required: true }],
}, { timestamps: true });

const VehicleModel = mongoose.model<VehicleDocument>("Vehicle", vehicleSchema);

export default VehicleModel;