import { Request, Response, NextFunction } from 'express';
import { createVehicle, findVehicle } from '../service/vehicleService';
import logger from '../utils/logger';
import { ErrorResponse } from '../types';

export const createVehicleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicle = await createVehicle(req.body);

        const isExistingVehicle = await findVehicle({
            make: vehicle.make.toLocaleLowerCase(),
            vehicleModel: vehicle.vehicleModel.toLocaleLowerCase()
        })

        if (isExistingVehicle.length > 1) {
            const error: ErrorResponse = {
                statusCode: 409,
                message: "Vehicle already exists",
                name: "VehicleExistsError"
            }
            throw error;
        }

        return res.status(201).send(vehicle.toJSON());
    } catch (err: any) {
        logger.error(err);
        const error: ErrorResponse = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}

export const getVehiclesByMakeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.query);
        const vehicles = await findVehicle({
            make: (req.query.make as string).toLocaleLowerCase()
        });
        console.log(vehicles);
        return res.status(200).send(vehicles);
    } catch (err: any) {
        logger.error(err);
        const error: ErrorResponse = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}