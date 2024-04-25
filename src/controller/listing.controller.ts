import { Request, Response, NextFunction } from 'express';
import { countListings, createVehicleListing, findListing, findListings, findOneAndDeleteListing, updateListing } from '../service/listing.service';
import { ErrorResponse } from '../types';
import logger from '../utils/logger';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { Conditions, ListingDocument, ListingFilters, ListingState, ListingType } from '../model/listing.model';
import { ObjectId, ObtainDocumentType } from 'mongoose';
import { add } from 'date-fns';
import { createBid } from '../service/bid.service';

export const createListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;
    const dateNow = new Date();

    const listing: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>> = {
        ...req.body,
        seller: user._id,
        auction: {
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
        console.log(response);
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

export const getListingsHandler = async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.query);

    // get query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search === "" ? undefined : req.query.search as string;
    const sortBy = req.query.sortBy === "createdAt" ? undefined : req.query.sortBy as string;
    const sortOrder = req.query.sortOrder === "" ? 'asc' : req.query.sortOrder as string;
    const condition = req.query.condition === "" ? undefined : req.query.condition as string;
    const make = req.query.make === "" ? undefined : req.query.make as string;
    const model = req.query.model === "" ? undefined : req.query.model as string;
    const mileageMax = req.query.mileageMax === "" || isNaN(parseInt(req.query.mileageMax as string)) ? undefined : parseInt(req.query.mileageMax as string);
    const mileageMin = req.query.mileageMin === "" || isNaN(parseInt(req.query.mileageMin as string)) ? undefined : parseInt(req.query.mileageMin as string);
    const yearMax = req.query.yearMax === "" || isNaN(parseInt(req.query.yearMax as string)) ? undefined : parseInt(req.query.yearMax as string);
    const yearMin = req.query.yearMin === "" || isNaN(parseInt(req.query.yearMin as string)) ? undefined : parseInt(req.query.yearMin as string);
    const priceMax = req.query.priceMax === "" || isNaN(parseInt(req.query.priceMax as string)) ? undefined : parseInt(req.query.priceMax as string);
    const priceMin = req.query.priceMin === "" || isNaN(parseInt(req.query.priceMin as string)) ? undefined : parseInt(req.query.priceMin as string);
    const transmission = req.query.transmission === "" ? undefined : req.query.transmission as string;
    const fuelType = req.query.fuelType === "" ? undefined : req.query.fuelType as string;
    const driveType = req.query.driveType === "" ? undefined : req.query.driveType as string;
    const listingType = req.query.listingType === "" ? undefined : req.query.listingType as string;

    // prepare filters

    let filters:Partial<ListingFilters> = {
        status: ListingState.active,
        isDeleted: false,
        ...(condition && { condition: condition as Conditions }),
        ...(make && { make: { $regex: make, $options: 'i' } }),
        ...(model && { vehicleModel: { $regex: model, $options: 'i' } }),
        ...(mileageMax && mileageMin && { mileage: { $gte: mileageMin, $lte: mileageMax } }),
        ...(mileageMax && !mileageMin && { mileage: { $lte: mileageMax } }),
        ...(mileageMin && !mileageMax && { mileage: { $gte: mileageMin } }),
        ...(yearMax && yearMin && { manufacturedYear: { $gte: yearMin, $lte: yearMax } }),
        ...(yearMax && !yearMin && { manufacturedYear: { $lte: yearMax } }),
        ...(yearMin && !yearMax && { manufacturedYear: { $gte: yearMin } }),
        ...(priceMax && priceMin && { fixedPrice: { $gte: priceMin, $lte: priceMax } }),
        ...(priceMax && !priceMin && { fixedPrice: { $lte: priceMax } }),
        ...(priceMin && !priceMax && { fixedPrice: { $gte: priceMin } }),
        ...(transmission && { transmission: { $regex: transmission, $options: 'i'}  }),
        ...(fuelType && { fuelType: {$regex: fuelType, $options: 'i'}}),
        ...(driveType && { driveType: {$regex: driveType, $options: 'i'}}),
        ...(listingType && { listingType: listingType as ListingType })
    };

    if(search){
        filters = {
            ...filters,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }
    }


    // prepare options
    const options = {
        limit,
        skip: (page-1) * limit, 
        sort: { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 }
    };

    console.log('Filters:', filters);
    console.log('Options:', options);

    try {
        // get listings and count
        const listings = await findListings(filters, options);
        const count = await countListings(filters);
        console.log('Listings:', listings);
        return res.status(200).send({
            data: listings,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (err: any) {
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

export const createBidHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    const { listingId } = req.params;
    const { amount } = req.body;

    console.log(amount);
    console.log(listingId);

    try {

        // check required fields
        if (!amount || amount <= 0 || isNaN(amount)) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Bid amount is required",
                name: "BidAmountError"
            }
            throw error;
        }


        // filter out the active listing that is an auction and has a starting date less than or equal to the current date
        const listing = await findListing({
            _id: listingId,
            listingType: ListingType.auction
        });

        if (!listing) {
            const error: ErrorResponse = {
                statusCode: 404,
                message: "Listing not found",
                name: "ListingNotFoundError"
            }
            throw error;
        }

        // check if the listing is not ended
        if (listing.status !== ListingState.active) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Looks like the listing is not active anymore",
                name: "ListingNotActiveError"
            }
            throw error;
        }


        // check if the listing is not owned by the user
        if (listing.seller.toString() === user._id.toString()) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "You cannot bid on your own listing",
                name: "OwnListingBidError"
            }
            throw error;
        }

        // check if the auction is not expired
        const currentDate = new Date();
        const auctionStartingDate = listing.auction.startingDate;
        const duration = listing.auction.duration;
        const auctionEndingDate = add(auctionStartingDate, {
            days: duration
        })
        if (currentDate > auctionEndingDate) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Auction has expired",
                name: "AuctionExpiredError"
            }
            throw error;
        }
        // check if the auction is started
        if (currentDate < auctionStartingDate) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Auction has not started yet",
                name: "AuctionNotStartedError"
            }
            throw error;
        }

        // check if the bid amount is greater than the current highest bid
        if (listing.auction.maxBid && amount <= listing.auction.maxBid) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "Bid amount must be greater than the current highest bid",
                name: "BidAmountError"
            }
            throw error;
        }
        // create a new bid
        const bid = await createBid({
            listing: listing._id,
            bidder: user._id,
            amount
        });

        // update the listing with the new bid
        const updates = {
            auction: {
                ...listing.auction,
                maxBid: amount,
                maxBidder: user._id,
                bids: [...listing.auction.bids, bid._id]
            } as ListingDocument['auction']
        }

        const updatedListing = await updateListing({
            _id: listingId
        }, updates);

        const response = {
            data: updatedListing,
            message: "Bid placed successfully",
            statusCode: 200,
            success: true
        }

        return res.status(200).send(response);

    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}