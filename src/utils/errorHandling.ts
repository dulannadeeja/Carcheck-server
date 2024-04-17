import { NextFunction } from "express";
import { ErrorResponse } from "../types";
import logger from "./logger";

export const sendErrorToErrorHandlingMiddleware = (err:any,next:NextFunction)=>{
    logger.error(err);
    const error: ErrorResponse = {
        statusCode: err.statusCode || 500,
        message: err.message,
        name: err.name
    }
    next(error);
}