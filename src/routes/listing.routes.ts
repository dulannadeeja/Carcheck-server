import { Express } from "express";
import { createBidHandler, createListingHandler, deleteListingHandler, getListingHandler, getListingsHandler, updateListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";
import uploadImage from "../lib/multerImageUploader";
import requireUser from "../middleware/requireUser";


function listingRoutes(app: Express) {
  app.post('/api/listings', validateResources(listingSchema), createListingHandler);
  app.post('/api/listings/images', uploadImage.array('listing_images', 12), uploadListingImagesHandler)
  app.get('/api/listings/:id', getListingHandler);
  app.get('/api/listings', getListingsHandler);
  app.put('/api/listings/:listingId', validateResources(listingSchema), updateListingHandler);
  app.delete('/api/listings/:listingId', deleteListingHandler);
  app.post('/api/listings/bid/:listingId', requireUser, createBidHandler);
}

export default listingRoutes;