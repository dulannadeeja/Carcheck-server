import { Express } from "express";
import { checkUserExistsHandler, createSellerHandler, createUserHandler, getFilteredUsersHandler, sellerDocumentsHandler, sendPhoneOTPHandler, updateUserStatusHandler, verifyOTPHandler } from "../controller/user.controller";
import validateResources from "../middleware/validateResources";
import { createUserSchema } from "../schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "../controller/session.controller";
import createSessionSchema from "../schema/session.schema";
import requireUser from "../middleware/requireUser";
import verificationSchema from "../schema/verification.schema";
import { sellerSchema } from "../schema/seller.schema";
import { sellerDocsSchema } from "../schema/sellerDocs.schema";
import userQuerySchema from "../schema/userQuery.schema";
function userRoutes(app: Express) {
  app.post('/api/users', validateResources(createUserSchema), createUserHandler);
  app.post('/api/sessions', validateResources(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser, getUserSessionsHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
  app.post('/api/users/search', checkUserExistsHandler)
  app.post('/api/users/verification/send', requireUser, validateResources(verificationSchema), sendPhoneOTPHandler)
  app.post('/api/users/verification/verify', requireUser, validateResources(verificationSchema), verifyOTPHandler)
  app.post('/api/users/seller/register', requireUser, validateResources(sellerSchema), createSellerHandler)
  app.post('/api/users/seller/documents', requireUser,validateResources(sellerDocsSchema), sellerDocumentsHandler);
  // this route must be wrapped in a middleware that checks if the user is the admin
  app.get('/api/users', validateResources(userQuerySchema),getFilteredUsersHandler)
  app.put('/api/users/:id/status', updateUserStatusHandler)
  // ------------------------------------------------------------------------------
}

export default userRoutes;