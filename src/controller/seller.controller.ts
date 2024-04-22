import { Request, Response, NextFunction } from 'express';
import { countListings, findListings } from '../service/listing.service';
import { ListingDocument } from '../model/listing.model';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';

export const getSellerListingsHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = typeof req.query.sort === 'string' ? req.query.sort.trim() : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : undefined;
    const title = typeof req.query.title === 'string' ? req.query.title.trim() : undefined;
    const make = typeof req.query.make === 'string' ? req.query.make.trim() : undefined;
    const model = typeof req.query.model === 'string' ? req.query.model.trim() : undefined;

    // prepare filters

    let filters = {
        ...(status && { status }),
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(make && { make: { $regex: make, $options: 'i' } }),
        ...(model && { model: { $regex: model, $options: 'i' } })
    };

    const options = {
        limit,
        skip: (page-1) * limit, 
        ...(sort && { sort: { [sort]: 1 as 1 } })
    };

    console.log('Filters:', filters);
    console.log('Options:', options);

    try {
        // get listings
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