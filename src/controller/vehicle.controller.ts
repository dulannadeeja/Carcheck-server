import { Request, Response, NextFunction } from 'express';
import { countDocuments, createVehicle, findAndDelete, findVehicle, findVehicles } from '../service/vehicle.service';
import { ErrorResponse } from '../types';
import { vehicleModels } from '../static/vehicleModels';
import { createSpecs } from '../service/specs.service';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { findBrand, getBrandById } from '../service/brand.service';
import { BrandDocument } from '../model/brand.model';

export const createVehicleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // check for duplicate vehicles
        const isExistingVehicle = await findVehicle({
            make: req.body.make.toLocaleLowerCase(),
            vehicleModel: req.body.vehicleModel.toLocaleLowerCase()
        })

        if (isExistingVehicle.length > 0) {
            const error: ErrorResponse = {
                statusCode: 409,
                message: "Vehicle already exists",
                name: "VehicleExistsError"
            }
            throw error;
        }

        const vehicle = await createVehicle(req.body);

        return res.status(201).send(vehicle.toJSON());
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const getVehiclesByMakeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const vehicles = await findVehicle({
            make: (req.query.make as string).toLocaleLowerCase()
        });
        
        return res.status(200).send(vehicles);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const getVehicleModelsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Extract and validate/sanitize input parameters
        const make = typeof req.query.make === 'string' ? req.query.make.trim() : undefined
        const category = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
        const page = parseInt(req.query.page as string) || undefined;
        const limit = parseInt(req.query.limit as string) || undefined;
        const sort = typeof req.query.sort === 'string' ? req.query.sort.trim() : undefined;

        let filters = { };

        if (make !== undefined && make !== '') {
            
            // Find the brand by name
            const brandDoc = await findBrand({ name: make });
            if (!brandDoc) {
                return res.status(404).json({ message: `Brand not found with name ${make}` });
            }

            // Prepare query filters
            filters = {
                isDeleted: false,
                make: brandDoc._id,
                ...(category && { category })
            };
        }

        filters = {
            isDeleted: false,
            ...(category && { category })
        };

        const options = {
            ...(limit && { limit }),
            ...(page && limit && { skip: (page - 1) * limit }),
            ...(sort && { sort: { [sort]: 1 } })
        };

        // Count total documents and find vehicles with pagination
        const count = await countDocuments(filters);
        const vehicles = await findVehicles(filters, options);

        // Respond with data and pagination details
        return res.status(200).json({
            data: vehicles,
            total: count,
            ...(page && { page }),
            ...(limit && { totalPages: Math.ceil(count / limit) })
        });
    } catch (err: any) {
        console.error('Error occurred while fetching vehicles:', err);
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const deleteVehicleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        const result = await findAndDelete({
            _id: id
        })
        if (!result) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Vehicle not found",
                name: "VehicleNotFoundError"
            }
            throw error;
        }
        return res.status(200).send(result);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const updateVehicleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const vehicle = await findVehicle({
            _id: id
        });

        if (vehicle.length === 0) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Vehicle not found",
                name: "VehicleNotFoundError"
            }
            throw error;
        }

        const updatedVehicle = await createVehicle(req.body);

        return res.status(200).send(updatedVehicle);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}


export async function processVehiclesHandler(res: Response) {
    try {
        for (const vehicle of vehicleModels) {
            const make = vehicle.Make.toLowerCase().trim();
            const vehicleModel = vehicle.Model.toLowerCase().trim();
            const category = vehicle.Category.toLowerCase().trim();

            console.log(`Processing vehicle: ${make} ${vehicleModel}, Category: ${category}`);

            let categories = [];
            categories = categorizeVehicle(category);

            // Ensure all categories are added to the specsModel
            for (const cat of categories) {
                console.log(`Checking/Adding category: ${cat}`);
                await createSpecs(cat, 'categories');
            }

            const data = {
                isDeleted: false,
                make,
                vehicleModel,
                category: categories,
            };

            // Check if vehicle already exists
            const existingVehicle = await findVehicle({ make, vehicleModel });
            if (existingVehicle.length !== 0) {
                console.log(`Vehicle already exists: ${make} ${vehicleModel}`);
            } else {
                await createVehicle(data);
                console.log(`Vehicle saved: ${make} ${vehicleModel}`);
            }
        }

        console.log('All vehicles processed successfully.');
        res.send('Vehicles saved successfully');
    } catch (err) {
        console.error('Error occurred while saving vehicles:', err);
        res.status(500).send('Error occurred while saving vehicles');
    }
}

function categorizeVehicle(category: string) {
    const singleWordRegex = /^[a-zA-Z]+$/;
    const separatedByCommaRegex = /^[a-zA-Z]+(,[a-zA-Z]+)+$/;
    const separatedBySlashRegex = /^[a-zA-Z]+(\/[a-zA-Z]+)+$/;

    let categories = [];
    if (singleWordRegex.test(category)) {
        categories.push(category);
    }
    if (separatedByCommaRegex.test(category)) {
        category.split(',').forEach(cat => categories.push(cat.trim()));
    }
    if (separatedBySlashRegex.test(category)) {
        category.split('/').forEach(cat => categories.push(cat.trim()));
    }
    return categories;
}