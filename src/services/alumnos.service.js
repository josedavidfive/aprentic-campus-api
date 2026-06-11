const Alumno = require('../models/Alumno');

const obtenerAlumnos = () => Alumno.find().populate('promocion');
const obtenerAlumnoPorId = (id) => Alumno.findById(id).populate('promocion');
const obtenerAlumnoPorEmail = (email) => Alumno.findOne({ email });
const crearAlumno = (alumnoData) => Alumno.create(alumnoData);
const actualizarAlumno = (id, alumnoData) => Alumno.findByIdAndUpdate(id, alumnoData, { new: true });
const eliminarAlumno = (id) => Alumno.findByIdAndDelete(id);

module.exports = { obtenerAlumnos, obtenerAlumnoPorId, obtenerAlumnoPorEmail, crearAlumno, actualizarAlumno, eliminarAlumno };