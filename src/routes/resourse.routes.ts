import { Express } from 'express'
import requireUser from '../middleware/requireUser'
import { uploadImageHandler, uploadPDFHandler } from '../controller/resource.controller'
import uploadPDF from '../lib/multerPDFUploader'
import uploadImage from '../lib/multerImageUploader'

function resourceRoutes(app: Express) {
    app.post('/api/resource/pdf', uploadPDF.array('pdf-files', 5), uploadPDFHandler)
    app.post('/api/resource/image', uploadImage.array('image-files', 12), uploadImageHandler)
}

export default resourceRoutes;