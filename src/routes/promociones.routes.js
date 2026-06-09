const express = require('express');
const router = express.Router();
const promocionesController = require('../controllers/promociones.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

router.get('/', authRequired, promocionesController.getAll);
router.get('/:id', authRequired, promocionesController.getById);
router.post('/', authRequired, requireRole('admin'), promocionesController.create);
router.put('/:id', authRequired, requireRole('admin'), promocionesController.update);
router.delete('/:id', authRequired, requireRole('admin'), promocionesController.remove);

module.exports = router;