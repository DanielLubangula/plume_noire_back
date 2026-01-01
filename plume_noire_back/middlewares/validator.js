import { body, param, validationResult } from 'express-validator';

export const loginValidationRules = () => [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const firstSetupValidationRules = () => [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const createBookValidationRules = () => [
  body('titre').notEmpty().withMessage('Titre requis'),
  body('statut').isIn(['gratuit', 'payant']).withMessage('Statut invalide'),
  body('prix').if(body('statut').equals('payant')).notEmpty().withMessage('Prix requis pour un livre payant').isFloat({ min: 0 }).withMessage('Prix invalide')
];

export const updateBookValidationRules = () => [
  body('titre').optional().notEmpty().withMessage('Titre invalide'),
  body('statut').optional().isIn(['gratuit', 'payant']).withMessage('Statut invalide'),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Prix invalide')
];

export const bookIdValidationRules = () => [
  param('id').isMongoId().withMessage('ID de livre invalide')
];

export const actusIdValidationRules = () => [
  param('id').isMongoId().withMessage("ID d'actu invalide")
];

export const createActuValidationRules = () => [
  body('titre').notEmpty().withMessage('Titre requis'),
  body('contenu').notEmpty().withMessage('Contenu requis')
];

export const updateActuValidationRules = () => [
  body('titre').optional().notEmpty().withMessage('Titre invalide'),
  body('contenu').optional().notEmpty().withMessage('Contenu invalide')
];

export const updateProfileValidationRules = () => [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('currentPassword').notEmpty().withMessage('Current password is required')
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', statusCode: 400, errors: errors.array() });
  }
  return next();
};

export default {
  loginValidationRules,
  firstSetupValidationRules,
  createBookValidationRules,
  updateBookValidationRules,
  bookIdValidationRules,
  actusIdValidationRules,
  createActuValidationRules,
  updateActuValidationRules,
  updateProfileValidationRules,
  validate
};
