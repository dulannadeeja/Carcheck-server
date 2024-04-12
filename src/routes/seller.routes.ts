import { Express } from "express";


import { getDraftsHandler } from "../controller/seller.controller";
import requireSeller from "../middleware/requireSeller";
function sellerRoutes(app: Express) { 
  app.get('/api/seller/drafts', requireSeller,getDraftsHandler)
}

export default sellerRoutes;