import { Request, Response, NextFunction } from 'express';
import { createVehicleListing } from '../service/listing.service';
import { ErrorResponse } from '../types';
import logger from '../utils/logger';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';

export const createListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;

    // set the seller responsible for the listing
    const listing = {
        ...req.body,
        seller: user._id
    }

    try {
        const response = await createVehicleListing(listing);
        console.log(response.toJSON());
        return res.status(201).send(response);
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

export const uploadListingImagesHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.files === undefined) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Images not uploaded",
                name: "ImagesNotUploadedError"
            }
            throw error;
        }

        const fileNames: string[] = [];
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];
        files.forEach((file: Express.Multer.File) => {
            fileNames.push(file.filename);
        });

        return res.status(201).json(
            {
                message: "Images uploaded successfully",
                fileNames: fileNames
            });

    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}