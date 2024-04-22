import { Express } from "express";
import { getSellerListingsHandler } from "../controller/seller.controller";

function sellerRoutes(app: Express) { 
  app.get('/api/seller/listings',getSellerListingsHandler)
}

export default sellerRoutes;