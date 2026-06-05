const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authRequired = require('../middlewares/authRequired');

router.get('/aptos-por-campus', authRequired, analyticsController.aptosPorCampus);
router.get('/alumnos-en-riesgo', authRequired, analyticsController.alumnosEnRiesgo);
router.get('/ranking-no-aptos', authRequired, analyticsController.rankingNoAptos);

module.exports = router;