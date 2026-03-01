import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import documentRoutes from './document.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/documents', documentRoutes);

export default router;
