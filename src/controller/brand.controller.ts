
import { Request,Response,NextFunction } from "express";
import { sendErrorToErrorHandlingMiddleware } from "../utils/errorHandling";
import { createBrand, deleteBrand, getBrandById, getBrands, isExistingBrand, updateBrand } from "../service/brand.service";

export const createBrandHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        // check if brand already exists
        const isExisting = await isExistingBrand(name);
        if(isExisting) return res.status(409).send({
            message: "Looks like this brand already exists!"
        });
        const brand = await createBrand(name);
        return res.send(brand);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const deleteBrandHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const brand = await deleteBrand(id);
        return res.send(brand);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}


export const getBrandsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands = await getBrands();
        return res.send(brands);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const getBrandByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const brand = await getBrandById(id);
        return res.send(brand);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const updateBrandHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, index } = req.body;
        const brand = await updateBrand(id, name, index);
        return res.send(brand);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}