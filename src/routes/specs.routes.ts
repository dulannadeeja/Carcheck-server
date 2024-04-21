import { Express } from 'express';
import requireAdmin from '../middleware/requireAdmin';
import validateResources from '../middleware/validateResources';
import { categorySchema } from '../schema/spec.schema';
import { createSpecHandler, deleteSpecHandler, getSpecHandler, updateSpecHandler } from '../controller/specs.controller';


function specsRoutes(app: Express) {
    app.post('/api/specs/',requireAdmin, validateResources(categorySchema), createSpecHandler);
    app.get('/api/specs/:specType', getSpecHandler);
    app.put('/api/specs/:id', requireAdmin, validateResources(categorySchema), updateSpecHandler);
    app.delete('/api/specs/:specType/:id', requireAdmin, deleteSpecHandler);
}   

export default specsRoutes;