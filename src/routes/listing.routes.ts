import { Express } from "express";
import { createListingHandler, getListingHandler, updateListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";
import uploadImage from "../lib/multerImageUploader";


function listingRoutes(app: Express) {
  app.post('/api/listings', validateResources(listingSchema), createListingHandler);
  app.post('/api/listings/images', uploadImage.array('listing_images', 12), uploadListingImagesHandler)
  app.get('/api/listings/:id', getListingHandler);
  app.put('/api/listings/:listingId', validateResources(listingSchema), updateListingHandler);
}

export default listingRoutes;