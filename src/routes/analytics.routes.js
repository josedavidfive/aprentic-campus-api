const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authRequired = require('../middlewares/auth.required');

/**
 * @swagger
 * /api/analytics/aptos-por-campus:
 *   get:
 *     summary: Tasa de aptos por campus
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Porcentaje de aptos agrupado por campus
 */
router.get('/aptos-por-campus', authRequired, analyticsController.aptosPorCampus);

/**
 * @swagger
 * /api/analytics/alumnos-en-riesgo:
 *   get:
 *     summary: Alumnos con nota media inferior a 5
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Lista de alumnos en riesgo con su nota media
 */
router.get('/alumnos-en-riesgo', authRequired, analyticsController.alumnosEnRiesgo);

/**
 * @swagger
 * /api/analytics/ranking-no-aptos:
 *   get:
 *     summary: Ranking de proyectos con más no aptos
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Proyectos ordenados de mayor a menor número de no aptos
 */
router.get('/ranking-no-aptos', authRequired, analyticsController.rankingNoAptos);

module.exports = router;