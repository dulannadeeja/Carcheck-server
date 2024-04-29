
import { FilterQuery, ObtainDocumentType, QueryOptions } from 'mongoose';
import VehicleModel, { VehicleDocument } from '../model/vehicle.model';

type FilterOptions = {
    limit: number;
    skip: number;
    sort: string;
}

export const createVehicle = async (input: ObtainDocumentType<Omit<VehicleDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        return await VehicleModel.create(input)
    } catch (err: any) {
        throw new Error(err);
    }
}

export const findVehicle = async (query: FilterQuery<VehicleDocument>) => {
    try {
        // find the vehicles and populate the make field
        return await VehicleModel.find(query).sort({ make: 1 }).populate('make').lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const findVehicles = async (
    filters: FilterQuery<VehicleDocument>,
    options: QueryOptions
): Promise<VehicleDocument[]> => {
    try {
        const results = await VehicleModel.find(filters)
        .populate('make')
            .limit(options.limit || 1000000)
            .skip(options.skip || 0)
            .sort(options.sort || {})
            .exec();
        return results;
    } catch (error) {
        console.error("Failed to find vehicles:", error);
        throw error; 
    }
}

export const countDocuments = async (filters: FilterQuery<VehicleDocument>) => {
    try {
        return await VehicleModel.countDocuments(filters);
    } catch (err: any) {
        throw new Error(err);
    }
}

export const findAndDelete = async (query: FilterQuery<VehicleDocument>) => {
    try {
        // find and set the isDeleted to true
        return await VehicleModel.findOneAndUpdate(query, { isDeleted: true }, { new: true }).lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const findAndUpdate = async (query: FilterQuery<VehicleDocument>, update: Partial<VehicleDocument>) => {
    try {
        return await VehicleModel.findOneAndUpdate(query, update).lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}