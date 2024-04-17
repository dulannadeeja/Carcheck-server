import { Request } from 'express';
import multer, { diskStorage, FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const pdfStorage = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'src/uploads/pdfs');  // Destination folder for uploaded PDFs
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const filename = uuidv4() + '-' + file.originalname;
        cb(null, filename);  // Unique filename for each uploaded PDF
    },
});

const pdfFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);  // Accept the file
    } else {
        cb(null, false);  // Reject the file
    }
};

const uploadPDF = multer({
    storage: pdfStorage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 * 5  // Set file size limit to 25MB for PDFs
    },
});

export default uploadPDF;