import { Request, Response, NextFunction } from 'express';
import { countListings, createVehicleListing, findListing, findListings, findOneAndDeleteListing, updateListing } from '../service/listing.service';
import { ErrorResponse, SoldBy, SortOptionsType } from '../types';
import logger from '../utils/logger';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import { Conditions, ListingDocument, ListingFilters, ListingState, ListingType } from '../model/listing.model';
import { ObtainDocumentType, QueryOptions } from 'mongoose';
import { add } from 'date-fns';
import { createBid } from '../service/bid.service';
import { AccountType, UserDocument } from '../model/user.model';

export const createListingHandler = async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;
    const draftId = req.body.draftId;

    if (!draftId) {
        const error: ErrorResponse = {
            statusCode: 400,
            message: "Draft ID is required",
            name: "DraftIdError"
        }
        throw error;
    }

    const dateNow = new Date();
    const listingValidity = add(dateNow, { days: 30 });

    const updates:Partial<ListingDocument> = {
        ...req.body,
        status: ListingState.active,
        auction: {
            ...req.body.auction,
            startingDate: req.body.listingType === ListingType.auction ? dateNow : undefined,
            bids: [],
            maxBid: req.body.listingType === ListingType.auction ? req.body.auction.startingBid : undefined,
            maxBidder: undefined
        },
        sellerType: user.accountType,
        seller: user._id,
        publishedAt: dateNow,
        draftUpdatedAt: dateNow,
        endDate: req.body.listingType === ListingType.auction ? add(dateNow, { days: req.body.auction.duration }) : listingValidity,
        currentPrice: req.body.listingType === ListingType.auction ? req.body.auction.startingBid
        : req.body.fixedPrice
    }

    try {
        const response = await updateListing({
            _id: draftId
        },updates);
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

export const createDraftHandler = async (req: Request, res: Response, next: NextFunction) => {
    
        const user = res.locals.user;
    
        const listing: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>> = {
            ...req.body,
            seller: user._id,
            status: ListingState.draft,
            sellerType: user.accountType,
            auction: {
                bids: [],
            },
            draftCreatedAt: new Date(),
            draftUpdatedAt: new Date(),
            publishedAt: undefined,
            endDate: undefined,
            currentPrice: undefined,
        }
    
        try {
            const response = await createVehicleListing(listing);
            return res.status(201).send(response);
        } catch (err: any) {
            sendErrorToErrorHandlingMiddleware(err, next);
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

export const endListingHandler = async (req: Request, res: Response, next: NextFunction) => {
    
        const { listingId } = req.params;

        // check weather the listing has active bids
        // if it has active bids, the listing cannot be ended

        try {
            const listing = await findListing({
                _id: listingId
            });
    
            if (!listing) {
                const error: ErrorResponse = {
                    statusCode: 404,
                    message: "Listing not found",
                    name: "ListingNotFoundError"
                }
                throw error;
            }

            if(listing.auction.bids.length > 0){
                const error: ErrorResponse = {
                    statusCode: 400,
                    message: "Listing has active bids, cannot be ended",
                    name: "ActiveBidsError"
                }
                throw error;
            }
    
            const updates = {
                status: ListingState.unsold,
                endDate: new Date(),
            }
    
            const updatedListing = await updateListing({
                _id: listingId
            }, updates);

            const response = {
                data: updatedListing,
                message: "Listing ended successfully",
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

    if (!listingId) {
        const error: ErrorResponse = {
            statusCode: 400,
            message: "Listing ID is required",
            name: "ListingIdError"
        }
        throw error;
    }

    // update listing data safely by restricting the fields that cannot be updated
    const restrictedFields = ['seller', 'createdAt', 'updatedAt','status','isDeleted','publishedAt','endDate','currentPrice','sellerType','draftCreatedAt','draftUpdatedAt'];

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

    // get query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search === "" ? undefined : req.query.search as string;
    const sortBy = req.query.sortBy === "" ? SortOptionsType.bestMatch : req.query.sortBy as string;
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
    const bodyType = req.query.bodyType === "" ? undefined : req.query.bodyType as string;
    const listingType = req.query.listingType === "" ? undefined : req.query.listingType as string;
    const soldBy = req.query.soldBy === "" ? undefined : req.query.soldBy as string;
    const city = req.query.city === "" ? undefined : req.query.city as string;
    const division = req.query.division === "" ? undefined : req.query.division as string;


    // extract comma separated values and convert them to arrays
    const conditions = condition ? (condition as string).split(',') : [];
    const makes = make ? (req.query.make as string).split(',') : [];
    const models = model ? (req.query.model as string).split(',') : [];
    const transmissions = transmission ? (req.query.transmission as string).split(',') : [];
    const fuelTypes = fuelType ? (req.query.fuelType as string).split(',') : [];
    const driveTypes = driveType ? (req.query.driveType as string).split(',') : [];
    const bodyTypes = bodyType ? (req.query.bodyType as string).split(',') : [];
    const soldBys = soldBy ? (req.query.soldBy as string).split(',') : [];

    const accountTypes = soldBys.map((soldBy) => {
        if (soldBy === SoldBy.dealer) {
            return AccountType.sellerBusiness;
        }
        if (soldBy === SoldBy.individual) {
            return AccountType.sellerPersonal;
        }
        if (soldBy === SoldBy.serviceProvider) {
            return AccountType.servicePoint;
        }
    });

    // prepare filters

    let filters: Partial<ListingFilters> = {
        status: ListingState.active,
        isDeleted: false,
        ...(condition && { condition: { $in: conditions as Conditions[] } }),
        ...(make && { make: { $in: makes } }),
        ...(model && { vehicleModel: { $in: models } }),
        ...(mileageMax && mileageMin && { mileage: { $gte: mileageMin, $lte: mileageMax } }),
        ...(mileageMax && !mileageMin && { mileage: { $lte: mileageMax } }),
        ...(mileageMin && !mileageMax && { mileage: { $gte: mileageMin } }),
        ...(yearMax && yearMin && { manufacturedYear: { $gte: yearMin, $lte: yearMax } }),
        ...(yearMax && !yearMin && { manufacturedYear: { $lte: yearMax } }),
        ...(yearMin && !yearMax && { manufacturedYear: { $gte: yearMin } }),
        ...(priceMax && priceMin && { currentPrice: { $gte: priceMin, $lte: priceMax } }),
        ...(priceMax && !priceMin && { currentPrice: { $lte: priceMax } }),
        ...(priceMin && !priceMax && { currentPrice: { $gte: priceMin } }),
        ...(transmission && { transmission: { $in: transmissions } }),
        ...(fuelType && { fuelType: { $in: fuelTypes } }),
        ...(driveType && { driveType: { $in: driveTypes } }),
        ...(listingType && { listingType: listingType as ListingType }),
        ...(bodyType && { bodyType: { $in: bodyTypes } }),
        ...(soldBy && { sellerType: { $in: accountTypes } }),
        ...(city && { 'location.city': { $regex: city, $options: 'i'  }}),
        ...(division && { 'location.division': { $regex: division, $options: 'i'  }})
    };

    if (search) {
        filters = {
            ...filters,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }
    }


    let options:QueryOptions = {
        limit,
        skip: (page - 1) * limit,
    }
    // prepare sorting
    switch (sortBy) {
        case SortOptionsType.bestMatch:
            break;
        case SortOptionsType.endingSoonest:
            options = {
                ...options,
                sort: { endDate: 1 }
            }
            break;
        case SortOptionsType.newlyListed:
            options = {
                ...options,
                sort: { createdAt: -1 }
            }
            break;
        case SortOptionsType.priceHighest:
            options = {
                ...options,
                sort: { currentPrice: -1 }
            }
            break;
        case SortOptionsType.priceLowest:
            options = {
                ...options,
                sort: { currentPrice: 1 }
            }
            break;
        default:
            break;
    }

    try {
        // get listings and count
        const listings = await findListings(filters, options);
        const count = await countListings(filters);
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

        const sellerDoc: UserDocument = listing.seller as unknown as UserDocument;
        

        // check if the listing is not owned by the user
        if (sellerDoc._id.toString() === user._id.toString()) {
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
            } as ListingDocument['auction'],
            currentPrice: amount
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