const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateUserCreate = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('role').optional().isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  handleValidationErrors
];

const validateRecord = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isDate().withMessage('Date must be a valid date (YYYY-MM-DD)'),
  body('notes').optional().isString(),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateUserCreate,
  validateUserUpdate,
  validateRecord
};
