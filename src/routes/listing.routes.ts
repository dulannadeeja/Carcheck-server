import { Express } from "express";
import { createListingHandler } from "../controller/listing.controller";
import upload from "../multer";


function listingRoutes(app: Express) {
  app.post('/api/listings',upload.array('listingImages'), createListingHandler);
}

export default listingRoutes;