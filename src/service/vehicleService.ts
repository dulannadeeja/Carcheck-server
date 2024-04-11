
import { FilterQuery, ObtainDocumentType } from 'mongoose';
import VehicleModel, { VehicleDocument } from '../model/vehicle.model';
export const createVehicle = async (input: ObtainDocumentType<Omit<VehicleDocument,'createdAt'|'updatedAt'>>) => {
    try{
        return await VehicleModel.create(input);
    }catch(err:any){
        throw new Error(err);
    }
}

export const findVehicle = async (query: FilterQuery<VehicleDocument>) => {
    try{
        return await VehicleModel.find(query).lean();
    }
    catch(err:any){
        throw new Error(err);
    }
}