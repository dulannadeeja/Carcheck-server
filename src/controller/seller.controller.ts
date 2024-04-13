import { Request, Response, NextFunction } from 'express';
import { getActiveListings, getDrafts, getListing } from '../service/seller.service';

export const getDraftsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    try {
        const drafts = await getDrafts(user.id);
        return res.status(200).send(drafts);
    } catch (err: any) {
        const error = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}

export const getActiveListingsHandler = async (req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user;

    try {
        const activeListings = await getActiveListings(user.id);
        return res.status(200).send(activeListings);
    } catch (err: any) {
        const error = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }

}

export const getListingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const listing = await getListing(req.params.id);
        if(!listing) return res.status(404).send({message: 'Listing not found'});
        console.log(listing.seller, res.locals.user._id);
        const seller = listing.seller.toString();
        if(seller !== res.locals.user._id) return res.status(403).send({message: 'Unauthorized'});
        return res.status(200).send(listing);
    }catch(err:any){
        const error = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }
}