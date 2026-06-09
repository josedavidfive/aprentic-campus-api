const promocionesService = require('../services/promociones.service');

const getAll = async (req, res, next) => {
  try {
    const promociones = await promocionesService.findAll();
    res.json(promociones);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const promocion = await promocionesService.findById(req.params.id);
    if (!promocion) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json(promocion);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const newPromocion = await promocionesService.create(req.body);
    res.status(201).json(newPromocion);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await promocionesService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await promocionesService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json({ message: 'Promoción eliminada', promocion: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };