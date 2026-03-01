import { body } from 'express-validator';
import { UserRole } from '../../types/enums';

export const registerValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères.'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères.'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis.')
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage('Le numéro de téléphone est invalide.'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage("L'adresse email est invalide.")
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.'),

  body('role')
    .notEmpty()
    .withMessage('Le rôle est requis.')
    .isIn(Object.values(UserRole))
    .withMessage(`Le rôle doit être l'un des suivants : ${Object.values(UserRole).join(', ')}.`),

  body('establishment_name')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Le nom de l'établissement ne peut pas dépasser 255 caractères."),

  body('licence_number')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Le numéro de licence ne peut pas dépasser 255 caractères.'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("L'adresse ne peut pas dépasser 500 caractères."),
];

export const loginValidator = [
  body('login')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone ou email est requis.'),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis.'),
];

export const requestOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis.')
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage('Le numéro de téléphone est invalide.'),
];

export const verifyOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis.')
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage('Le numéro de téléphone est invalide.'),

  body('otp')
    .trim()
    .notEmpty()
    .withMessage('Le code OTP est requis.')
    .isLength({ min: 6, max: 6 })
    .withMessage('Le code OTP doit contenir 6 chiffres.')
    .isNumeric()
    .withMessage('Le code OTP doit être numérique.'),
];
