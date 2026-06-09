const Profesor = require('../models/Profesor');

const obtenerProfesores = () => Profesor.find().populate('usuario');
const obtenerProfesorPorId = (id) => Profesor.findById(id).populate('usuario');
const obtenerProfesorPorEmail = (email) => Profesor.findOne({ email });
const crearProfesor = (profesorData) => Profesor.create(profesorData);
const actualizarProfesor = (id, profesorData) => Profesor.findByIdAndUpdate(id, profesorData, { new: true });
const eliminarProfesor = (id) => Profesor.findByIdAndDelete(id);

module.exports = { obtenerProfesores, obtenerProfesorPorId, obtenerProfesorPorEmail, crearProfesor, actualizarProfesor, eliminarProfesor };