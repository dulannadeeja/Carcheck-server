import { Express } from "express";
import { createBidHandler, createDraftHandler, createListingHandler, deleteListingHandler, endListingHandler, getListingHandler, getListingsHandler, updateListingHandler, uploadListingImagesHandler } from "../controller/listing.controller";
import validateResources from "../middleware/validateResources";
import { listingSchema } from "../schema/listing.schema";
import uploadImage from "../lib/multerImageUploader";
import requireUser from "../middleware/requireUser";
import requireSeller from "../middleware/requireSeller";


function listingRoutes(app: Express) {
  app.post('/api/listings/draft',requireSeller, createDraftHandler);
  app.put('/api/listings/draft/:listingId',requireSeller,updateListingHandler);
  app.post('/api/listings/images', uploadImage.array('listing_images', 12), uploadListingImagesHandler)
  app.post('/api/listings',requireSeller, validateResources(listingSchema), createListingHandler);
  app.put('/api/listings/end/:listingId',requireSeller, endListingHandler)
  app.get('/api/listings/:id', getListingHandler);
  app.get('/api/listings', getListingsHandler);
  app.put('/api/listings/:listingId', requireSeller,validateResources(listingSchema), updateListingHandler);
  app.delete('/api/listings/:listingId', requireSeller,deleteListingHandler);
  app.post('/api/listings/bid/:listingId', requireUser, createBidHandler);
}

export default listingRoutes;