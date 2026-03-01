import { body } from 'express-validator';

export const updateProfileValidator = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères.'),

  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères.'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage("L'adresse email est invalide.")
    .normalizeEmail(),

  body('blood_group')
    .optional()
    .trim()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Groupe sanguin invalide.'),

  body('allergies')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Les allergies ne peuvent pas dépasser 1000 caractères.'),

  body('treating_doctor')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Le nom du médecin traitant ne peut pas dépasser 255 caractères.'),

  body('establishment_name')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Le nom de l'établissement ne peut pas dépasser 255 caractères."),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("L'adresse ne peut pas dépasser 500 caractères."),

  body('is_online')
    .optional()
    .isBoolean()
    .withMessage('La valeur de disponibilité doit être un booléen.'),

  body('current_latitude')
    .optional()
    .isDecimal()
    .withMessage('La latitude doit être un nombre décimal.'),

  body('current_longitude')
    .optional()
    .isDecimal()
    .withMessage('La longitude doit être un nombre décimal.'),

  body('action_radius_km')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Le rayon d'action doit être entre 1 et 100 km."),
];
