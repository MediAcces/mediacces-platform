import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import {
  registerValidator,
  loginValidator,
  requestOtpValidator,
  verifyOtpValidator,
} from './validators/auth.validators';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Kouadio"
 *               last_name:
 *                 type: string
 *                 example: "Aya"
 *               phone:
 *                 type: string
 *                 example: "+2250101020304"
 *               email:
 *                 type: string
 *                 example: "aya.kouadio@email.com"
 *               password:
 *                 type: string
 *                 example: "MonMotDePasse1"
 *               role:
 *                 type: string
 *                 enum: [patient, chauffeur, coursier, hopital, pharmacie, admin]
 *                 example: "patient"
 *               establishment_name:
 *                 type: string
 *                 example: "CHU de Cocody"
 *               licence_number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Téléphone ou email déjà utilisé
 */
router.post('/register', registerValidator, validate, AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Numéro de téléphone ou email
 *                 example: "+2250101020304"
 *               password:
 *                 type: string
 *                 example: "MonMotDePasse1"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', loginValidator, validate, AuthController.login);

/**
 * @swagger
 * /api/auth/request-otp:
 *   post:
 *     summary: Demander un code OTP par SMS
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+2250101020304"
 *     responses:
 *       200:
 *         description: Code OTP envoyé
 *       404:
 *         description: Numéro non trouvé
 */
router.post('/request-otp', requestOtpValidator, validate, AuthController.requestOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Vérifier un code OTP
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+2250101020304"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP vérifié, JWT retourné
 *       400:
 *         description: Code incorrect ou expiré
 */
router.post('/verify-otp', verifyOtpValidator, validate, AuthController.verifyOtp);

export default router;
