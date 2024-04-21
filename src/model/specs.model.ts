
import mongoose from "mongoose";
import { colorOptions } from "./listing.model";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
})

categorySchema.pre("deleteOne", async function(next) {
    const category:CategoryDocument = this as any;
    const products = await mongoose.model('Listing').find({ bodyType: category._id }).exec();
    if (products.length > 0) {
        next(new Error('Cannot delete category because it is referenced by products.'));
    } else {
        next();
    }
});

const transmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
})

const fuelTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
})

const driveTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
})

const colorOptionsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
})

const specsSchema = new mongoose.Schema({
    categories: { type: [categorySchema], required: false },
    transmission: { type: [transmissionSchema], required: false },
    fuelType: { type: [fuelTypeSchema], required: false },
    driveType: { type: [driveTypeSchema], required: false },
    colorOptions: { type: [colorOptionsSchema], required: false },
})

export interface CategoryDocument {
    _id: mongoose.Types.ObjectId;
    name: string;
    value: string;
    isDeleted: boolean;
}

export interface TransmissionDocument {
    name: string;
    value: string;
    isDeleted: boolean;
}

export interface FuelTypeDocument {
    name: string;
    value: string;
    isDeleted: boolean;
}

export interface DriveTypeDocument {
    name: string;
    value: string;
    isDeleted: boolean;
}

export interface ColorOptionsDocument {
    name: string;
    value: string;
    isDeleted: boolean;
}

export interface SpecsDocument extends mongoose.Document {
    categories: CategoryDocument[];
    transmission: TransmissionDocument[];
    fuelType: FuelTypeDocument[];
    driveType: DriveTypeDocument[];
    colorOptions: ColorOptionsDocument[];
}

const specsModel = mongoose.model<SpecsDocument>("Spec", specsSchema);

export default specsModel;

