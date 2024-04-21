import requireAdmin from "../middleware/requireAdmin"
import validateResources from "../middleware/validateResources"
import { createBrandHandler, deleteBrandHandler, getBrandsHandler, updateBrandHandler } from "../controller/brand.controller"
import { brandSchema } from "../schema/brand.schema"
import { Express } from 'express'

const brandRoutes = (app:Express) => {
    app.post('/api/brands',requireAdmin,validateResources(brandSchema),createBrandHandler)
    app.delete('/api/brands/:id',requireAdmin,deleteBrandHandler)
    app.put('/api/brands/:id',requireAdmin,validateResources(brandSchema),updateBrandHandler)
    app.get('/api/brands',getBrandsHandler)
}

export default brandRoutes