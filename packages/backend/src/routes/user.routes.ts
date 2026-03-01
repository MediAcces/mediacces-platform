import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateProfileValidator } from './validators/user.validators';

const router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', authenticate, UserController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               blood_group:
 *                 type: string
 *                 enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
 *               allergies:
 *                 type: string
 *               treating_doctor:
 *                 type: string
 *               establishment_name:
 *                 type: string
 *               address:
 *                 type: string
 *               is_online:
 *                 type: boolean
 *               current_latitude:
 *                 type: number
 *               current_longitude:
 *                 type: number
 *               action_radius_km:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 */
router.put('/profile', authenticate, updateProfileValidator, validate, UserController.updateProfile);

export default router;
