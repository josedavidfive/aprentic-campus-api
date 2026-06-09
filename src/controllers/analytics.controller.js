const analyticsService = require('../services/analytics.service');

const aptosPorCampus = async (req, res, next) => {
  try {
    const resultado = await analyticsService.aptosPorCampus();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const alumnosEnRiesgo = async (req, res, next) => {
  try {
    const resultado = await analyticsService.alumnosEnRiesgo();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const rankingNoAptos = async (req, res, next) => {
  try {
    const resultado = await analyticsService.rankingNoAptos();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { aptosPorCampus, alumnosEnRiesgo, rankingNoAptos };