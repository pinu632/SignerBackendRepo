import express from 'express'
import { deletefield, getAllDocumentsForUser, getDocumentWithFields, getDocumnetAssignedToUser, getFileUrlFromQuery, handleSendSignerEvent } from '../controller/Document.controller.js'
import { authMiddlewar } from '../middleware/auth.middleware.js'
const router = express.Router()



router.post('/:docId/fields/save',handleSendSignerEvent)
router.get('/getDocument',authMiddlewar,getAllDocumentsForUser)
router.get('/getDocument/:id',getDocumentWithFields)
router.get('/getassignedDocument',authMiddlewar,getDocumnetAssignedToUser)
router.post('/deleteField/:field_id',deletefield)
router.get('/getUrl/:id',getFileUrlFromQuery)





export default router;