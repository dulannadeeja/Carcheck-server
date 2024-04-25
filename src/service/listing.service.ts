import { FilterQuery, FlattenMaps, ObtainDocumentType, QueryOptions } from "mongoose";
import listingModel, { ListingDocument, ListingState, ListingType } from "../model/listing.model";
import { add } from "date-fns";

export const createVehicleListing = async (input: ObtainDocumentType<Omit<ListingDocument, 'createdAt' | 'updatedAt'>>) => {
    try {
        const listing = await listingModel.create(input);
        return listing;
    } catch (err: any) {
        throw new Error(err);
    }
}

export const findListing = async (query: FilterQuery<ListingDocument>) => {
    try {
        const listing = await listingModel.findOne(query).populate('seller').populate({
            path: 'auction.bids',
            model: 'Bid',
        }).lean();
        console.log(listing?.auction.bids);
        if (!listing) {
            throw new Error('Listing not found');
        }

        let updatedListing = listing

        // if the listing is an auction, check if the auction has ended
        if (listing.listingType === ListingType.auction) {
            const currentDate = new Date();
            const startingDate = listing.auction.startingDate;
            const duration = listing.auction.duration;
            const endingDate = add(new Date(startingDate), { days: duration });
            if (currentDate > endingDate) {

                // check if there are any bids
                if (listing.auction.bids.length > 0) {
                    // update the listing to closed
                    await listingModel.findOneAndUpdate({
                        _id: listing._id
                    }, {
                        status: ListingState.sold
                    }, {
                        new: true
                    }).lean();

                    updatedListing = {
                        ...updatedListing,
                        status: ListingState.sold
                    }
                    
                }

                // update the listing to closed
                await listingModel.findOneAndUpdate({
                    _id: listing._id
                }, {
                    status: ListingState.unsold
                }, {
                    new: true
                }).lean();
                
                updatedListing = {
                    ...updatedListing,
                    status: ListingState.unsold
                }
            }
        }
        return updatedListing;
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const findListings = async (query: FilterQuery<ListingDocument>, options: QueryOptions) => {

    try {
        // find the listings
        const listings = await listingModel.find({
            ...query,
            isDeleted: false
        }, null, options).populate('seller').populate('auction.bids').lean();

        if (listings.length === 0) {
            throw new Error('Listings not found');
        }

        // make the array of all listings
        let updatedListings = listings;

        // check if the listing is an auction, check if the auction has ended
        // update the database if the auction has ended
        // update also the fetched listings
        listings.forEach(async (listing) => {
            if (listing.listingType === ListingType.auction) {
                const currentDate = new Date();
                const startingDate = listing.auction.startingDate;
                const duration = listing.auction.duration;
                const endingDate = add(new Date(startingDate), { days: duration });
                if (currentDate > endingDate) {

                    // check if there are any bids
                    if (listing.auction.bids.length > 0) {
                        // update the listing to closed
                        const updatedListing = await listingModel.findOneAndUpdate({
                            _id: listing._id
                        }, {
                            status: ListingState.sold
                        }, {
                            new: true
                        }).lean();
                        if (updatedListing) {
                            updatedListings = updatedListings.map((list) => {
                                if (list._id === updatedListing._id) {
                                    return updatedListing;
                                }
                                return list;
                            });
                        }
                    }

                    // update the listing to closed
                    const updatedListing = await listingModel.findOneAndUpdate({
                        _id: listing._id
                    }, {
                        status: ListingState.unsold
                    }, {
                        new: true
                    }).lean();
                    if (updatedListing) {
                        updatedListings = updatedListings.map((list) => {
                            if (list._id === updatedListing._id) {
                                return updatedListing;
                            }
                            return list;
                        });
                    }
                }
            }
        })

        return updatedListings;

    } catch (err: any) {
        throw new Error(err);
    }

}

export const countListings = async (query: FilterQuery<ListingDocument>) => {
    try {
        return await listingModel.countDocuments(query);
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateListing = async (query: FilterQuery<ListingDocument>, updates: Partial<ListingDocument>) => {
    try {
        const updatedListing = await listingModel.findOneAndUpdate(query, updates, {
            new: true
        }).lean();
        return updatedListing;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const findOneAndDeleteListing = async (query: FilterQuery<ListingDocument>) => {
    try {
        return await listingModel.findOneAndUpdate(query, {
            isDeleted: true
        }, {
            new: true
        })
    } catch (error: any) {
        throw new Error(error);
    }
}