import { Express } from "express";
import validateResources from "../middleware/validateResources";
import requireSeller from "../middleware/requireSeller";
import { inspectionRequestSchema } from "../schema/inspectionRequest.schema";
import { createInspectionScheduleHandler } from "../controller/inspection.controller";


function inspectionRoutes(app: Express) {
    app.post('/api/inspection/schedule', requireSeller, validateResources(inspectionRequestSchema), createInspectionScheduleHandler);
}

export default inspectionRoutes;