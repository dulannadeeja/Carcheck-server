import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodType } from 'zod';
import { ErrorResponse, FieldError } from '../types';

const validateResources = (schema: ZodType<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
    }
    catch (err: any) {
        let fieldErrors: FieldError[] = [];
        for (const error of err.errors) {
            const customError: FieldError = {
                field: error.path[1],
                message: error.message
            };
            fieldErrors.push(customError);
        }
        const error: ErrorResponse = {
            statusCode: 400,
            message: "Resources Validation Error",
            fieldErrors: fieldErrors,
            name: "ResourcesValidationError"
        }
        next(error);
        return;
    }
    next();
};

export default validateResources;