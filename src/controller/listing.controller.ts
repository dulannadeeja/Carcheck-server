import { Request, Response, NextFunction } from 'express';
import { createVehicleListing, findListing, updateListing } from '../service/listing.service';
import { ErrorResponse } from '../types';
import logger from '../utils/logger';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { ListingState } from '../model/listing.model';

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

export const getListingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        const listing = await findListing({
            _id: id
        });

        if (!listing) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Listing not found",
                name: "ListingNotFoundError"
            }
            throw error;
        }

        return res.status(200).send(listing);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const updateListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const {listingId} = req.params;
    const updates = req.body;

    console.log(updates);

    // update listing data safely by restricting the fields that cannot be updated
    const restrictedFields = ['seller', 'createdAt', 'updatedAt'];

    if(!updates) {
        return res.status(400).send({ message: "No updates provided" });
    }

    // clean the updates object by removing restricted fields
    Object.keys(updates).forEach((update) => {
        if (restrictedFields.includes(update)) {
            delete updates[update];
        }
    });

    try {
        const updatedListing = await updateListing({
            _id: listingId
        }, updates);

        if (!updatedListing) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Listing not found",
                name: "ListingNotFoundError"
            }
            throw error;
        }

        return res.status(200).send(updatedListing);
    }
    catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
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