import express, { Request, Response, NextFunction, Application, Express } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectMongo from './utils/connection';
import logger from './utils/logger';
import userRoutes from './routes/user.routes';
import deserializeUser from './middleware/deserializeUser';
import { ErrorResponse } from './types';
import vehicleRoutes from './routes/vehicle.routes';
import listingRoutes from './routes/listing.routes';
import sellerRoutes from './routes/seller.routes';
import inspectionRoutes from './routes/inspection.routes';
import { createTransporter } from './lib/nodemailer';
import resourceRoutes from './routes/resourse.routes';

// Configure dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.join(__dirname, 'config', '.env'),
  });
}

// setup nodemailer transport for sending emails
export const nodemailerTransport = createTransporter({
  service: process.env.SMTP_SERVICE as string,
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER as string,
  pass: process.env.SMTP_PASS as string,
})

// Handling uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handling unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err);
  process.exit(1);
});

const app: Express = express();

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL as string);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-refresh-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Serve static files
app.use('/api/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/api/pdfs', express.static(path.join(__dirname, 'uploads', 'pdfs')));

// Parse requests of content-type: application/json
app.use(bodyParser.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Middleware to deserialize user from access token
app.use(deserializeUser);

// Routes
userRoutes(app);
vehicleRoutes(app);
listingRoutes(app);
sellerRoutes(app);
inspectionRoutes(app);
resourceRoutes(app);

// Error handling middleware
app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || 500).send(
    error
  );
  logger.error(error);
});


const PORT: number = parseInt(process.env.SERVER_PORT as string, 10) || 8080;

const startServer = async (): Promise<Application> => {
  return new Promise<Application>((resolve, reject) => {
    app.listen(PORT, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }
      logger.info(`Server is running on port ${PORT}`);
      resolve(app);
    });
  });
};

connectMongo().then(() => {
  startServer();
});
