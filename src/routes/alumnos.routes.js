const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnoscontroller');
const authRequired = require('../middlewares/authRequired');
const requireRole = require('../middlewares/requireRole');

router.get('/', authRequired, alumnosController.getAll);
router.get('/:id', authRequired, alumnosController.getById);
router.post('/', authRequired, requireRole('admin'), alumnosController.create);
router.put('/:id', authRequired, requireRole('admin'), alumnosController.update);
router.delete('/:id', authRequired, requireRole('admin'), alumnosController.remove);

module.exports = router;