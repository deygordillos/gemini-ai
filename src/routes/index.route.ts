import { Router } from 'express'
import geminiRoutes from './gemini.route'
const router = Router();

router.use('/v1/gemini', geminiRoutes);

export default router