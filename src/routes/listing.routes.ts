import { Express } from "express";
import { createListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";
import requireUser from "../middleware/requireUser";
import requireSeller from "../middleware/requireSeller";
import uploadImage from "../lib/multerImageUploader";


function listingRoutes(app: Express) {
  app.post('/api/listings', validateResources(listingSchema), createListingHandler);
  app.post('/api/listings/images', uploadImage.array('listing_images', 12), uploadListingImagesHandler)
}

export default listingRoutes;