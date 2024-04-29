import { Request, Response, NextFunction } from 'express';

import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';
import {  createSpecs, deleteSpec, getSpecs, updateSpec} from '../service/specs.service';
import { SpecsDocument } from '../model/specs.model';

export const createSpecHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { name,specType } = req.body;

    try {
        const spec = await createSpecs(name, specType as keyof SpecsDocument);
        return res.send(spec);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }

}

export const updateSpecHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { name,specType } = req.body;

    try {
        const spec = await updateSpec(id, name, specType as keyof SpecsDocument);
        return res.send(spec);

    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const deleteSpecHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id,specType } = req.params;
        const spec = await deleteSpec(id, specType as keyof SpecsDocument);
        return res.send(spec);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

export const getSpecHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { specType } = req.params;

    try {
        const result = await getSpecs(specType as keyof SpecsDocument);
        return res.send(result);
    } catch (err) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}
