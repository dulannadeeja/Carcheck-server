import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
        return res.status(401).send({
            message: "You need to be logged in to perform this action",
            statusCode: 401,
            name: "UnauthorizedError",
            success: false
        });
    }
    next();
}

export default requireUser;