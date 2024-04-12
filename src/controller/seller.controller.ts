import { Request, Response, NextFunction } from 'express';
import { getDrafts } from '../service/seller.service';

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