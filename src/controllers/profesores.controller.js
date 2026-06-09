const profesoresService = require('../services/profesores.service');

const getAll = async (req, res, next) => {
  try {
    const profesores = await profesoresService.findAll();
    res.json(profesores);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const profesor = await profesoresService.findById(req.params.id);
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json(profesor);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const newProfesor = await profesoresService.create(req.body);
    res.status(201).json(newProfesor);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await profesoresService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await profesoresService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json({ message: 'Profesor eliminado', profesor: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };