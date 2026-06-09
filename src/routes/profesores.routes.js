const express = require('express');
const router = express.Router();
const profesoresController = require('../controllers/profesores.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

router.get('/', authRequired, requireRole('admin'), profesoresController.getAll);
router.get('/:id', authRequired, requireRole('admin'), profesoresController.getById);
router.post('/', authRequired, requireRole('admin'), profesoresController.create);
router.put('/:id', authRequired, requireRole('admin'), profesoresController.update);
router.delete('/:id', authRequired, requireRole('admin'), profesoresController.remove);

module.exports = router;