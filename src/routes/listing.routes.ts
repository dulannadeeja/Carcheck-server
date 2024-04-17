import { Express } from "express";
import { createListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import upload from "../lib/multerImageUploader";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";
import requireUser from "../middleware/requireUser";
import requireSeller from "../middleware/requireSeller";


function listingRoutes(app: Express) {
  app.post('/api/listings', validateResources(listingSchema), upload.array('listingImages'), createListingHandler);
  app.post('/api/listings/images', upload.array('listing_images', 12), uploadListingImagesHandler)
}

export default listingRoutes;