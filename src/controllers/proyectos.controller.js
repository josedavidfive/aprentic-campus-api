const proyectosService = require('../services/proyectos.service');

const getAll = async (req, res, next) => {
  try {
    const proyectos = await proyectosService.obtenerProyectos();
    res.json(proyectos);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const proyecto = await proyectosService.obtenerProyectoPorId(req.params.id);
    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const newProyecto = await proyectosService.crearProyecto(req.body);
    res.status(201).json(newProyecto);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await proyectosService.actualizarProyecto(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await proyectosService.eliminarProyecto(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado', proyecto: deleted });
  } catch (err) {
    next(err);
  }
};

const addNota = async (req, res, next) => {
  try {
    const proyecto = await proyectosService.añadirNota(req.params.id, req.body);
    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(201).json(proyecto);
  } catch (err) {
    next(err);
  }
};

const updateNota = async (req, res, next) => {
  try {
    const proyecto = await proyectosService.actualizarNota(req.params.id, req.params.notaId, req.body);
    if (!proyecto) return res.status(404).json({ error: 'Proyecto o nota no encontrado' });
    res.json(proyecto);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, addNota, updateNota };