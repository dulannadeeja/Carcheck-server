import { Express } from "express";
import validateResources from "../middleware/validateResources";
import { createVehicleSchema } from "../schema/vehicle.schema";
import { createVehicleHandler, deleteVehicleHandler, getVehicleModelsHandler, getVehiclesByMakeHandler, processVehiclesHandler, updateVehicleHandler } from "../controller/vehicle.controller";
import requireAdmin from "../middleware/requireAdmin";


function vehicleRoutes(app: Express) {
    app.post('/api/vehicles', validateResources(createVehicleSchema), createVehicleHandler),
    app.get('/api/vehicles', getVehicleModelsHandler)
    app.get('/api/vehicles/save', processVehiclesHandler)
    app.delete('/api/vehicles/:id', requireAdmin, deleteVehicleHandler )
    app.put('/api/vehicles/:id', requireAdmin, validateResources(createVehicleSchema), updateVehicleHandler)
}

export default vehicleRoutes;