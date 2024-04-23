import { Request, Response, NextFunction } from 'express';
import { createVehicleListing, findListing, findOneAndDeleteListing, updateListing } from '../service/listing.service';
import { ErrorResponse } from '../types';
import logger from '../utils/logger';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { ListingDocument, ListingState, ListingType } from '../model/listing.model';
import { ObtainDocumentType } from 'mongoose';

export const createListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;
    const dateNow = new Date();

    const listing:ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>> = {
        ...req.body,
        seller: user._id,
        auction:{
            ...req.body.auction,
            startingDate: req.body.listingType === ListingType.auction ? dateNow : undefined,
        }
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
        const response = {
            data: listing,
            message: "Listing found",
            statusCode: 200,
            success: true
        }
        return res.status(200).send(response);
    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const updateListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { listingId } = req.params;
    const updates = req.body;

    console.log(updates);

    // update listing data safely by restricting the fields that cannot be updated
    const restrictedFields = ['seller', 'createdAt', 'updatedAt'];

    if (!updates) {
        return res.status(400).send({ message: "No updates provided" });
    }

    // clean the updates object by removing restricted fields
    Object.keys(updates).forEach((update) => {
        if (restrictedFields.includes(update)) {
            delete updates[update];
        }
    });

    // if listing is in auction, recal the auction starting date
    if (updates.listingType === ListingType.auction && updates.listingState === ListingState.active) {
        updates.auction = {
            startingDate: new Date()
        }
    }

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

export const deleteListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { listingId } = req.params;

    try {
        const deletedListing = await findOneAndDeleteListing({
            _id: listingId
        })

        if (!deletedListing) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Listing not found",
                name: "ListingNotFoundError"
            }
            throw error;
        }

        return res.status(200).send(deletedListing);
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