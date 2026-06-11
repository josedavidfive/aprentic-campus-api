const alumnosService = require('../services/alumnos.service');

const getAll = async (req, res, next) => {
  try {
    const alumnos = await alumnosService.obtenerAlumnos();
    res.json(alumnos);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const alumno = await alumnosService.obtenerAlumnoPorId(req.params.id);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
    res.json(alumno);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const newAlumno = await alumnosService.crearAlumno(req.body);
    res.status(201).json(newAlumno);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await alumnosService.actualizarAlumno(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Alumno no encontrado' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await alumnosService.eliminarAlumno(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Alumno no encontrado' });
    res.json({ message: 'Alumno eliminado', alumno: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };