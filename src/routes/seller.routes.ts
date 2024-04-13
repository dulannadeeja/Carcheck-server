import { Express } from "express";


import { getActiveListingsHandler, getDraftsHandler, getListingHandler } from "../controller/seller.controller";
import requireSeller from "../middleware/requireSeller";

function sellerRoutes(app: Express) { 
  app.get('/api/seller/drafts', requireSeller,getDraftsHandler)
  app.get('/api/seller/active', requireSeller,getActiveListingsHandler)
  app.get('/api/seller/listing/:id', requireSeller, getListingHandler)
}

export default sellerRoutes;