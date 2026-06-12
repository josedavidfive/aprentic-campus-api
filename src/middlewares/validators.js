const { body, validationResult } = require('express-validator');

// Middleware que corta la petición si hay errores de validación
const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ─────────────────────────────────────────────
// ALUMNO
// ─────────────────────────────────────────────
const validarAlumno = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .trim()
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),

  body('promocion')
    .notEmpty().withMessage('La promoción es obligatoria')
    .isMongoId().withMessage('El ID de promoción no es válido'),

  validar
];

// ─────────────────────────────────────────────
// PROFESOR
// ─────────────────────────────────────────────
const validarProfesor = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .trim()
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),

  validar
];

// ─────────────────────────────────────────────
// PROYECTO
// ─────────────────────────────────────────────
const validarProyecto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres'),

  body('promocion')
    .notEmpty().withMessage('La promoción es obligatoria')
    .isMongoId().withMessage('El ID de promoción no es válido'),

  validar
];

// ─────────────────────────────────────────────
// NOTA
// ─────────────────────────────────────────────
const validarNota = [
  body('alumno')
    .notEmpty().withMessage('El alumno es obligatorio')
    .isMongoId().withMessage('El ID de alumno no es válido'),

  body('nota')
    .notEmpty().withMessage('La nota es obligatoria')
    .isFloat({ min: 0, max: 10 }).withMessage('La nota debe ser un número entre 0 y 10'),

  validar
];

module.exports = { validarAlumno, validarProfesor, validarProyecto, validarNota };