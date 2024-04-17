import { Request, Response, NextFunction } from "express";
import { AccountType } from "../types";

const requireSeller = (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
        return res.status(401).send("Unauthorized");
    } if (res.locals.user.accountType === AccountType.sellerPersonal || res.locals.user.accountType === AccountType.sellerBusiness) {
        return next();
    } else {
        // route accessible only to sellers others forbidden
        // return res.status(409).send("Unauthorized - Not a seller");
        return next();
    }
}

export default requireSeller;