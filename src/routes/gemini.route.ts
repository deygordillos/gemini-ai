import { Router } from 'express'
import { getOCRDataImageByBase64 } from '../controllers/gemini.controller';

const router = Router();

router.get('/ocr', getOCRDataImageByBase64);

export default router