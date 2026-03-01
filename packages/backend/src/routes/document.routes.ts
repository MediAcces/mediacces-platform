import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { uploadDocumentValidator, validateDocumentValidator } from './validators/document.validators';
import { UserRole } from '../types/enums';

const router = Router();

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Téléverser un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [permis, carte_grise, assurance, agrement_ambulance, carte_coursier, licence_pharmacie]
 *     responses:
 *       201:
 *         description: Document téléversé
 *       400:
 *         description: Fichier manquant ou type invalide
 *       401:
 *         description: Non authentifié
 */
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  uploadDocumentValidator,
  validate,
  DocumentController.upload
);

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Lister les documents de l'utilisateur connecté
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticate, DocumentController.getUserDocuments);

/**
 * @swagger
 * /api/documents/{documentId}/validate:
 *   put:
 *     summary: Valider ou rejeter un document (admin uniquement)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               rejection_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document validé/rejeté
 *       403:
 *         description: Accès non autorisé
 */
router.put(
  '/:documentId/validate',
  authenticate,
  authorize(UserRole.ADMIN),
  validateDocumentValidator,
  validate,
  DocumentController.validateDocument
);

export default router;
