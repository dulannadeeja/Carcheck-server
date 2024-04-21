import { FilterQuery } from "mongoose";
import brandModel, { BrandDocument } from "../model/brand.model";

export const getBrands = async () => {
    try {
        return await brandModel.find().lean();
    } catch (err: any) {
        throw new Error(err);
    }
}

export const getBrandById = async (id: string) => {
    try {
        return await brandModel
            .findById(id)
            .lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const createBrand = async (name: string) => {

    name = name.toLowerCase().trim();
    try {
        // assign index to the last index + 1
        const lastBrand = await brandModel.findOne().sort({ index: -1 }).lean();
        const index = lastBrand ? lastBrand.index + 1 : 0;
        return await brandModel.create({
            name,
            index
        });
    } catch (err: any) {
        throw new Error(err);
    }
}


export const updateBrand = async (id: string, name: string, index: number) => {

    name = name.toLowerCase().trim();
    try {

        // find the brand by id
        const brand = await brandModel.findById(id).lean();

        if (!brand) {
            throw new Error("Brand not found");
        }

        // if name is same as the current name, update the index only
        if(brand.name === name) return await brandModel.findByIdAndUpdate(id, { index }, { new: true }).lean();

        // check if brand already exists
        const existingBrand = await brandModel.findOne({ name }).lean();

        // if brand already exists and the id is different, throw an error
        if(existingBrand && existingBrand._id !== id) throw new Error("Brand already exists");

        // update the brand
        return await brandModel
            .findByIdAndUpdate(id, {
                name,
                index
            }, { new: true })
            .lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const deleteBrand = async (id: string) => {
    try {
        return await brandModel
            .findByIdAndDelete(id)
            .lean();
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const isExistingBrand = async (name: string) => {
    name = name.toLowerCase().trim();
    try {
        const brand = await brandModel.findOne({
            name
        }).lean();
        return !!brand;
    }catch(err: any){
        throw new Error(err);
    }
}

export const findBrand = async (query: FilterQuery<BrandDocument>) => {
    try {
        return await brandModel.findOne(query).lean()
    }
    catch (err: any) {
        throw new Error(err);
    }
}