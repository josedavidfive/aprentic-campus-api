const express = require('express');
const router = express.Router();
const promocionesController = require('../controllers/promociones.controller');
const authRequired = require('../middlewares/auth.required');
const requireRole = require('../middlewares/role.required');

/**
 * @swagger
 * /api/promociones:
 *   get:
 *     summary: Obtener todas las promociones
 *     tags: [Promociones]
 *     responses:
 *       200:
 *         description: Lista de promociones
 */
router.get('/', authRequired, promocionesController.getAll);

/**
 * @swagger
 * /api/promociones/{id}:
 *   get:
 *     summary: Obtener una promoción por ID
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promoción encontrada
 *       404:
 *         description: Promoción no encontrada
 */
router.get('/:id', authRequired, promocionesController.getById);

/**
 * @swagger
 * /api/promociones:
 *   post:
 *     summary: Crear una promoción
 *     tags: [Promociones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promocion'
 *     responses:
 *       201:
 *         description: Promoción creada
 */
router.post('/', authRequired, requireRole('admin'), promocionesController.create);

/**
 * @swagger
 * /api/promociones/{id}:
 *   put:
 *     summary: Actualizar una promoción
 *     tags: [Promociones]
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
 *             $ref: '#/components/schemas/Promocion'
 *     responses:
 *       200:
 *         description: Promoción actualizada
 *       404:
 *         description: Promoción no encontrada
 */
router.put('/:id', authRequired, requireRole('admin'), promocionesController.update);

/**
 * @swagger
 * /api/promociones/{id}:
 *   delete:
 *     summary: Eliminar una promoción
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promoción eliminada
 *       404:
 *         description: Promoción no encontrada
 */
router.delete('/:id', authRequired, requireRole('admin'), promocionesController.remove);

module.exports = router;