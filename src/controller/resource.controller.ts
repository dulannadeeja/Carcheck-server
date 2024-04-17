import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';
import { sendErrorToErrorHandlingMiddleware } from '../utils/errorHandling';

export const uploadPDFHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.files === undefined) {
            const error: ErrorResponse = {
                statusCode: 400,
                message: "files not uploaded",
                name: "ImagesNotUploadedError"
            }
            throw error;
        }

        const fileNames: string[] = [];
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];
        files.forEach((file: Express.Multer.File) => {
            fileNames.push(file.filename);
        });

        return res.status(201).json(
            {
                message: "files uploaded successfully",
                fileNames: fileNames
            });

    } catch (err: any) {
        sendErrorToErrorHandlingMiddleware(err, next);
    }
}

