const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', authRequired, proyectosController.getAll);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', authRequired, proyectosController.getById);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       201:
 *         description: Proyecto creado
 */
router.post('/', authRequired, requireRole('admin'), proyectosController.create);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
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
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', authRequired, requireRole('admin'), proyectosController.update);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', authRequired, requireRole('admin'), proyectosController.remove);

/**
 * @swagger
 * /api/proyectos/{id}/notas:
 *   post:
 *     summary: Añadir una nota a un proyecto
 *     tags: [Proyectos]
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
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       201:
 *         description: Nota añadida
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/:id/notas', authRequired, requireRole('admin', 'profesor'), proyectosController.addNota);

/**
 * @swagger
 * /api/proyectos/{id}/notas/{notaId}:
 *   put:
 *     summary: Actualizar una nota de un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: notaId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       200:
 *         description: Nota actualizada
 *       404:
 *         description: Proyecto o nota no encontrado
 */
router.put('/:id/notas/:notaId', authRequired, requireRole('admin', 'profesor'), proyectosController.updateNota);

module.exports = router;