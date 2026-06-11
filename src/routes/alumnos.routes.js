const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

router.get('/', authRequired, alumnosController.getAll);
router.get('/:id', authRequired, alumnosController.getById);
router.post('/', authRequired, requireRole('admin'), alumnosController.create);
router.put('/:id', authRequired, requireRole('admin'), alumnosController.update);
router.delete('/:id', authRequired, requireRole('admin'), alumnosController.remove);

module.exports = router;