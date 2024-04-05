import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
        return res.status(401).send("Unauthorized");
    }
    next();
}

export default requireUser;