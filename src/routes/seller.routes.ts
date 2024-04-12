import { Express } from "express";


import { getActiveListingsHandler, getDraftsHandler } from "../controller/seller.controller";
import requireSeller from "../middleware/requireSeller";

function sellerRoutes(app: Express) { 
  app.get('/api/seller/drafts', requireSeller,getDraftsHandler)
  app.get('/api/seller/active', requireSeller,getActiveListingsHandler)
}

export default sellerRoutes;