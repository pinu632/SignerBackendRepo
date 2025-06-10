import express from 'express'
import { authMiddlewar } from '../middleware/auth.middleware.js';
import { UploadFile } from '../controller/file.controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({storage})

const router = express.Router()


router.post('/upload',authMiddlewar,upload.single('file'),UploadFile);


export default router;