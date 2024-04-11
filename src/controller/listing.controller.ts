import { Request, Response, NextFunction } from 'express';

export const createListingHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
    } catch (err: any) {
        console.log(err)
    }
}