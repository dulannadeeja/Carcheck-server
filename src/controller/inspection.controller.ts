import { Request, Response, NextFunction, response } from "express";
import { InspectionDocument } from "../model/inspection.model";
import { createInspectionSchedule } from "../service/inspection.service";
import { ObtainDocumentType } from "mongoose";
import logger from "../utils/logger";
import { ErrorResponse } from "../types";

export const createInspectionScheduleHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id
    

    const inspectionObj: ObtainDocumentType<Omit<InspectionDocument, 'createdAt' | 'updatedAt'>> = {
        serviceProvider: userId, // this id need to be change to the id of service provider
        serviceBranch: req.body.serviceBranch,
        seller: userId,
        listing: req.body.listing,
        inspectionDateTime: req.body.inspectionTime
    }

    try {

        const inspection = await createInspectionSchedule(inspectionObj);
        return res.status(201).json(inspection);

    } catch (err: any) {
        logger.error(err);
        const error: ErrorResponse = {
            statusCode: err.statusCode || 500,
            message: err.message,
            name: err.name
        }
        next(error);
    }

}