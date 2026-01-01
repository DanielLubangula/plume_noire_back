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
  body('prix').if(body('statut').equals('payant')).notEmpty().withMessage('Prix requis pour un livre payant').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('is_featured').optional().isBoolean().withMessage('is_featured doit être un booléen').toBoolean()
];

export const updateBookValidationRules = () => [
  body('titre').optional().notEmpty().withMessage('Titre invalide'),
  body('statut').optional().isIn(['gratuit', 'payant']).withMessage('Statut invalide'),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('is_featured').optional().isBoolean().withMessage('is_featured doit être un booléen').toBoolean()
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

export const profileValidationRules = () => [
  body('biographie').optional().isString().withMessage('Biographie invalide'),
  body('email_contact').optional().isEmail().withMessage('Email invalide'),
  body('socials').optional().custom(value => {
    // accept JSON string or array
    let arr = value;
    if (typeof value === 'string') {
      try {
        arr = JSON.parse(value);
      } catch (e) {
        throw new Error('Format socials invalide (JSON attendu)');
      }
    }
    if (!Array.isArray(arr)) throw new Error('Socials doit être un tableau');
    for (const s of arr) {
      if (!s.network || !s.url) throw new Error('Chaque social doit contenir network et url');
      if (typeof s.network !== 'string' || typeof s.url !== 'string') throw new Error('Format social invalide');
    }
    return true;
  })
];

export const updateProfileValidationRules = () => [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('biographie').optional().isString().withMessage('Biographie invalide'),
  body('socials').optional().custom(value => {
    let arr = value;
    if (typeof value === 'string') {
      try {
        arr = JSON.parse(value);
      } catch (e) {
        throw new Error('Format socials invalide (JSON attendu)');
      }
    }
    if (!Array.isArray(arr)) throw new Error('Socials doit être un tableau');
    for (const s of arr) {
      if (!s.network || !s.url) throw new Error('Chaque social doit contenir network et url');
      if (typeof s.network !== 'string' || typeof s.url !== 'string') throw new Error('Format social invalide');
    }
    return true;
  })
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
  profileValidationRules,
  updateProfileValidationRules,
  validate
};
