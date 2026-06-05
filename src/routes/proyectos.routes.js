const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const authRequired = require('../middlewares/authRequired');
const requireRole = require('../middlewares/requireRole');

router.get('/', authRequired, proyectosController.getAll);
router.get('/:id', authRequired, proyectosController.getById);
router.post('/', authRequired, requireRole('admin'), proyectosController.create);
router.put('/:id', authRequired, requireRole('admin'), proyectosController.update);
router.delete('/:id', authRequired, requireRole('admin'), proyectosController.remove);
router.post('/:id/notas', authRequired, requireRole('admin', 'profesor'), proyectosController.addNota);
router.put('/:id/notas/:notaId', authRequired, requireRole('admin', 'profesor'), proyectosController.updateNota);

module.exports = router;