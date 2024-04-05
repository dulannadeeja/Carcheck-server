import { Request } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage, FileFilterCallback } from 'multer';

// Multer storage configuration
const storage = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/images'); // Destination folder for uploaded images
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, uuidv4() + '-' + file.originalname); // Unique filename for each uploaded image
    },
});

// Multer file filter configuration
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // set file size limit to 10MB
        fileSize: 1024 * 1024 * 10,
    },
});

export default upload;
