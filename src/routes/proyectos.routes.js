const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

router.get('/', authRequired, proyectosController.getAll);
router.get('/:id', authRequired, proyectosController.getById);
router.post('/', authRequired, requireRole('admin', 'profesor'), proyectosController.create);
router.put('/:id', authRequired, requireRole('admin', 'profesor'), proyectosController.update);
router.delete('/:id', authRequired, requireRole('admin', 'profesor'), proyectosController.remove);
router.post('/:id/notas', authRequired, requireRole('admin', 'profesor'), proyectosController.addNota);
router.put('/:id/notas/:notaId', authRequired, requireRole('admin', 'profesor'), proyectosController.updateNota);
router.post('/:id/alumnos', authRequired, requireRole('admin', 'profesor'), proyectosController.inscribirAlumno);

module.exports = router;