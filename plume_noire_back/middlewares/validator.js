import { body, validationResult } from 'express-validator';

export const loginValidationRules = () => [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const firstSetupValidationRules = () => [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
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
  updateProfileValidationRules,
  validate
};
