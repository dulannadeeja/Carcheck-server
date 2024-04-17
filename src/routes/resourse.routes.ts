import { Express } from 'express'
import requireUser from '../middleware/requireUser'
import { uploadPDFHandler } from '../controller/resource.controller'
import uploadPDF from '../lib/multerPDFUploader'

function resourceRoutes(app: Express) {
    app.post('/api/resource/pdf', uploadPDF.array('pdf-files', 5), uploadPDFHandler)
}

export default resourceRoutes;