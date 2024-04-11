import { Express } from "express";
import { createListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import upload from "../multer";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";


function listingRoutes(app: Express) {
  app.post('/api/listings', validateResources(listingSchema), upload.array('listingImages'), createListingHandler);
  app.post('/api/listings/images', upload.array('listing_images', 12), uploadListingImagesHandler)
}

export default listingRoutes;