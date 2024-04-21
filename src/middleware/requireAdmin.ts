import { Request, Response, NextFunction } from 'express';
import { AccountType } from '../types';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
        return res.status(401).send("Unauthorized");
    } if (res.locals.user.accountType === AccountType.admin) {
        return next();
    } else {
        return res.status(409).send("Unauthorized - Not an admin");
    }
}

export default requireAdmin;