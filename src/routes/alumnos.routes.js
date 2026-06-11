const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     summary: Obtener todos los alumnos
 *     tags: [Alumnos]
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *       401:
 *         description: Sin token
 */
router.get('/', authRequired, alumnosController.getAll);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   get:
 *     summary: Obtener un alumno por ID
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumno encontrado
 *       404:
 *         description: Alumno no encontrado
 */
router.get('/:id', authRequired, alumnosController.getById);

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     summary: Crear un alumno
 *     tags: [Alumnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       201:
 *         description: Alumno creado
 *       401:
 *         description: Sin token
 *       403:
 *         description: Sin permisos
 */
router.post('/', authRequired, requireRole('admin'), alumnosController.create);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   put:
 *     summary: Actualizar un alumno
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       200:
 *         description: Alumno actualizado
 *       404:
 *         description: Alumno no encontrado
 */
router.put('/:id', authRequired, requireRole('admin', 'profesor'), alumnosController.update);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   delete:
 *     summary: Eliminar un alumno
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumno eliminado
 *       404:
 *         description: Alumno no encontrado
 */
router.delete('/:id', authRequired, requireRole('admin'), alumnosController.remove);

module.exports = router;