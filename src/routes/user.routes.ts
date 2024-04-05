import { Express } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResources from "../middleware/validateResources";
import { createUserSchema } from "../schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "../controller/session.controller";
import createSessionSchema from "../schema/session.schema";
import requireUser from "../middleware/requireUser";
function userRoutes(app: Express) {
  app.post('/api/users', validateResources(createUserSchema), createUserHandler);
  app.post('/api/sessions', validateResources(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser,getUserSessionsHandler)
  app.delete('/api/sessions', requireUser,deleteSessionHandler)
}

export default userRoutes;