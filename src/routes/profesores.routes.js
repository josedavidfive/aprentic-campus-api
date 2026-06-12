const express = require('express');
const router = express.Router();
const profesoresController = require('../controllers/profesores.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');
const { validarProfesor } = require('../middlewares/validators');

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags: [Profesores]
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       403:
 *         description: Sin permisos
 */
router.get('/', authRequired, profesoresController.getAll);

/**
 * @swagger
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtener un profesor por ID
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesor encontrado
 *       404:
 *         description: Profesor no encontrado
 */
router.get('/:id', authRequired, profesoresController.getById);

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Crear un profesor
 *     tags: [Profesores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profesor'
 *     responses:
 *       201:
 *         description: Profesor creado
 */
router.post('/', authRequired, requireRole('admin'), validarProfesor, profesoresController.create);

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualizar un profesor
 *     tags: [Profesores]
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
 *             $ref: '#/components/schemas/Profesor'
 *     responses:
 *       200:
 *         description: Profesor actualizado
 *       404:
 *         description: Profesor no encontrado
 */
router.put('/:id', authRequired, requireRole('admin'), validarProfesor, profesoresController.update);

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Eliminar un profesor
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesor eliminado
 *       404:
 *         description: Profesor no encontrado
 */
router.delete('/:id', authRequired, requireRole('admin'), profesoresController.remove);

module.exports = router;