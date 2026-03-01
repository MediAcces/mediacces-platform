import { body, param } from 'express-validator';
import { DocumentType, DocumentStatus } from '../../types/enums';

export const uploadDocumentValidator = [
  body('type')
    .notEmpty()
    .withMessage('Le type de document est requis.')
    .isIn(Object.values(DocumentType))
    .withMessage(`Le type de document doit être l'un des suivants : ${Object.values(DocumentType).join(', ')}.`),
];

export const validateDocumentValidator = [
  param('documentId')
    .isUUID()
    .withMessage('Identifiant de document invalide.'),

  body('status')
    .notEmpty()
    .withMessage('Le statut est requis.')
    .isIn([DocumentStatus.APPROVED, DocumentStatus.REJECTED])
    .withMessage('Le statut doit être "approved" ou "rejected".'),

  body('rejection_reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La raison du rejet ne peut pas dépasser 500 caractères.'),
];
