import { Request, Response, NextFunction } from 'express';
import { countDocuments, createVehicle, findAndDelete, findVehicle, findVehicles } from '../service/vehicle.service';
import { ErrorResponse } from '../types';
import { vehicleModels } from '../static/vehicleModels';
import { createSpecs } from '../service/specs.service';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { createBrand, createBrands, findBrand, findBrands} from '../service/brand.service';


export const createVehicleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // check for duplicate vehicles
        const isExistingVehicle = await findVehicle({
            make: req.body.make.toLocaleLowerCase(),
            vehicleModel: req.body.vehicleModel.toLocaleLowerCase()
        })

        if (isExistingVehicle) {
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

        console.log('Make:', make);

        if (make !== undefined && make !== '') {
            
            // Find the brand by name
            const brandDoc = await findBrand({ name: make });
            if (!brandDoc) {
                return res.status(404).json({ message: `Brand not found with name ${make}` });
            }

            // Prepare query filters
            filters = {
                 make: brandDoc._id 
            };

            console.log('Filters:', filters);
        }

        filters = {
            ...filters,
            isDeleted: false,
            ...(category && { category })
        };

        const options = {
            ...(limit && { limit }),
            ...(page && limit && { skip: (page - 1) * limit }),
            ...(sort && { sort: { ['vehicleModel']: 1 } })
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

        if (vehicle) {
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


export async function processVehiclesHandler(res: Response, req: Request) {
    try {
        // Collect all unique brands from vehicleModels
        const uniqueBrands = new Set(vehicleModels.map(vehicle => vehicle.Make.toLowerCase().trim()));

        console.log('Processing vehicles...');
        console.log('Unique brands:', uniqueBrands);

        // Fetch existing brands from the database and map them for quick access
        const existingBrands = await findBrands({ name: { $in: Array.from(uniqueBrands) } });
        console.log('Existing brands:', existingBrands);
        const brandMap = new Map(existingBrands.map(brand => [brand.name, brand._id]));
        console.log('Brand map:', brandMap);

        // Determine which brands need to be added
        const brandsToCreate = Array.from(uniqueBrands).filter(brand => !brandMap.has(brand));
        const newBrandDocs = await createBrands(brandsToCreate.map(name => ( name )));
        newBrandDocs.forEach(brand => brandMap.set(brand.name, brand._id));

        // Now process each vehicle
        for (const vehicle of vehicleModels) {
            const make = vehicle.Make.toLowerCase().trim();
            const vehicleModel = vehicle.Model.toLowerCase().trim();
            const category = vehicle.Category.toLowerCase().trim();

            console.log(`Processing vehicle: ${make} ${vehicleModel}, Category: ${category}`);

            let categories = categorizeVehicle(category);

            // Process categories in parallel
            await Promise.all(categories.map(cat => createSpecs(cat, 'categories')));

            // Retrieve or create brand document ID
            const brandId = brandMap.get(make);

            // Check if vehicle already exists
            const existingVehicle = await findVehicle({ make: brandId, vehicleModel });
            if (!existingVehicle) {
                const data = {
                    isDeleted: false,
                    make: brandId,
                    vehicleModel,
                    category: categories,
                };

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